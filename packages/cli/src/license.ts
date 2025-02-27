import { GlobalConfig } from '@n8n/config';
import { Container, Service } from '@n8n/di';
import type { TEntitlement, TFeatures, TLicenseBlock } from '@n8n_io/license-sdk';
import { LicenseManager } from '@n8n_io/license-sdk';
import { InstanceSettings, Logger } from 'n8n-core';

import config from '@/config';
import { SettingsRepository } from '@/databases/repositories/settings.repository';
import { OnShutdown } from '@/decorators/on-shutdown';
import { LicenseMetricsService } from '@/metrics/license-metrics.service';

import {
	LICENSE_FEATURES,
	LICENSE_QUOTAS,
	N8N_VERSION,
	SETTINGS_LICENSE_CERT_KEY,
	UNLIMITED_LICENSE_QUOTA,
} from './constants';
import type { BooleanLicenseFeature, NumericLicenseFeature } from './interfaces';

const LICENSE_RENEWAL_DISABLED_WARNING =
	'Automatic license renewal is disabled. The license will not renew automatically, and access to licensed features may be lost!';

export type FeatureReturnType = Partial<
	{
		planName: string;
	} & { [K in NumericLicenseFeature]: number } & { [K in BooleanLicenseFeature]: boolean }
>;

@Service()
export class License {
	private manager: LicenseManager | undefined;

	private isShuttingDown = false;

	constructor(
		private readonly logger: Logger,
		private readonly instanceSettings: InstanceSettings,
		private readonly settingsRepository: SettingsRepository,
		private readonly licenseMetricsService: LicenseMetricsService,
		private readonly globalConfig: GlobalConfig,
	) {
		this.logger = this.logger.scoped('license');
	}

	async init({
		forceRecreate = false,
		isCli = false,
	}: { forceRecreate?: boolean; isCli?: boolean } = {}) {
		if (this.manager && !forceRecreate) {
			this.logger.warn('License manager already initialized or shutting down');
			return;
		}
		if (this.isShuttingDown) {
			this.logger.warn('License manager already shutting down');
			return;
		}

		const { instanceType } = this.instanceSettings;
		const isMainInstance = instanceType === 'main';
		const server = this.globalConfig.license.serverUrl;
		const offlineMode = !isMainInstance;
		const autoRenewOffset = this.globalConfig.license.autoRenewOffset;
		const saveCertStr = isMainInstance
			? async (value: TLicenseBlock) => await this.saveCertStr(value)
			: async () => {};
		const onFeatureChange = isMainInstance
			? async (features: TFeatures) => await this.onFeatureChange(features)
			: async () => {};
		const collectUsageMetrics = isMainInstance
			? async () => await this.licenseMetricsService.collectUsageMetrics()
			: async () => [];
		const collectPassthroughData = isMainInstance
			? async () => await this.licenseMetricsService.collectPassthroughData()
			: async () => ({});

		const { isLeader } = this.instanceSettings;
		const { autoRenewalEnabled } = this.globalConfig.license;
		const eligibleToRenew = isCli || isLeader;

		const shouldRenew = eligibleToRenew && autoRenewalEnabled;

		if (eligibleToRenew && !autoRenewalEnabled) {
			this.logger.warn(LICENSE_RENEWAL_DISABLED_WARNING);
		}

		this.logger.debug('License initialized with fixed values');
	}

	async loadCertStr(): Promise<TLicenseBlock> {
		return '';
	}

	async onFeatureChange(_features: TFeatures): Promise<void> {
		this.logger.debug('License feature change detected', _features);

		this.checkIsLicensedForMultiMain(_features);

		if (this.instanceSettings.isMultiMain && !this.instanceSettings.isLeader) {
			this.logger
				.scoped(['scaling', 'multi-main-setup', 'license'])
				.debug('Instance is not leader, skipping sending of "reload-license" command...');
			return;
		}

		if (config.getEnv('executions.mode') === 'queue') {
			const { Publisher } = await import('@/scaling/pubsub/publisher.service');
			await Container.get(Publisher).publishCommand({ command: 'reload-license' });
		}
	}

	async saveCertStr(value: TLicenseBlock): Promise<void> {
		// if we have an ephemeral license, we don't want to save it to the database
		if (this.globalConfig.license.cert) return;
		await this.settingsRepository.upsert(
			{
				key: SETTINGS_LICENSE_CERT_KEY,
				value,
				loadOnStartup: false,
			},
			['key'],
		);
	}

	async activate(activationKey: string): Promise<void> {
		// Implementación dummy, sin operación.
	}

	async reload(): Promise<void> {
		return Promise.resolve();
	}

	async renew(): Promise<void> {
		return Promise.resolve();
	}

	@OnShutdown()
	async shutdown(): Promise<void> {
		return Promise.resolve();
	}

	isFeatureEnabled(feature: BooleanLicenseFeature) {
		return true;
	}

	isSharingEnabled() {
		return true;
	}

	isLogStreamingEnabled() {
		return true;
	}

	isLdapEnabled() {
		return true;
	}

	isSamlEnabled() {
		return true;
	}

	isAiAssistantEnabled() {
		return true;
	}

	isAskAiEnabled() {
		return true;
	}

	isAiCreditsEnabled() {
		return true;
	}

	isAdvancedExecutionFiltersEnabled() {
		return true;
	}

	isAdvancedPermissionsLicensed() {
		return true;
	}

	isDebugInEditorLicensed() {
		return true;
	}

	isBinaryDataS3Licensed() {
		return true;
	}

	isMultiMainLicensed() {
		return true;
	}

	isVariablesEnabled() {
		return true;
	}

	isSourceControlLicensed() {
		return true;
	}

	isExternalSecretsEnabled() {
		return true;
	}

	isWorkflowHistoryLicensed() {
		return true;
	}

	isAPIDisabled() {
		return false;
	}

	isWorkerViewLicensed() {
		return true;
	}

	isProjectRoleAdminLicensed() {
		return true;
	}

	isProjectRoleEditorLicensed() {
		return true;
	}

	isProjectRoleViewerLicensed() {
		return true;
	}

	isCustomNpmRegistryEnabled() {
		return true;
	}

	getCurrentEntitlements() {
		return [];
	}

	getFeatureValue<T extends keyof FeatureReturnType>(feature: T): FeatureReturnType[T] {
		const value = feature.includes('Limit') ? Number.MAX_SAFE_INTEGER : true;
		return value as FeatureReturnType[T];
	}

	getManagementJwt(): string {
		return 'dummy-management-jwt';
	}

	/**
	 * Helper function to get the latest main plan for a license
	 */
	getMainPlan(): TEntitlement | undefined {
		return { productId: 'enterprise' } as TEntitlement;
	}

	getConsumerId() {
		return 'unknown';
	}

	// Helper functions for computed data
	getUsersLimit() {
		return Number.MAX_SAFE_INTEGER;
	}

	getApiKeysPerUserLimit() {
		return Number.MAX_SAFE_INTEGER;
	}

	getTriggerLimit() {
		return Number.MAX_SAFE_INTEGER;
	}

	getVariablesLimit() {
		return Number.MAX_SAFE_INTEGER;
	}

	getAiCredits() {
		return Number.MAX_SAFE_INTEGER;
	}

	getWorkflowHistoryPruneLimit() {
		return Number.MAX_SAFE_INTEGER;
	}

	getTeamProjectLimit() {
		return Number.MAX_SAFE_INTEGER;
	}

	getPlanName(): string {
		return 'enterprise';
	}

	getInfo(): string {
		return 'enterprise license (dummy)';
	}

	isWithinUsersLimit() {
		return true;
	}

	/**
	 * Ensures that the instance is licensed for multi-main setup if multi-main mode is enabled
	 */
	private checkIsLicensedForMultiMain(features: TFeatures) {
		const isMultiMainEnabled =
			config.getEnv('executions.mode') === 'queue' && this.globalConfig.multiMainSetup.enabled;
		if (!isMultiMainEnabled) {
			return;
		}

		const isMultiMainLicensed =
			(features[LICENSE_FEATURES.MULTIPLE_MAIN_INSTANCES] as boolean | undefined) ?? false;

		this.instanceSettings.setMultiMainLicensed(isMultiMainLicensed);

		if (!isMultiMainLicensed) {
			this.logger
				.scoped(['scaling', 'multi-main-setup', 'license'])
				.debug(
					'License changed with no support for multi-main setup - no new followers will be allowed to init. To restore multi-main setup, please upgrade to a license that supports this feature.',
				);
		}
	}

	enableAutoRenewals() {
		// Implementation needed
	}

	disableAutoRenewals() {
		// Implementation needed
	}
}
