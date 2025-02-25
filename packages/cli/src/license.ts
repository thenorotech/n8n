/**
 * License module override to always enforce the Enterprise license.
 * Todas las validaciones han sido eliminadas y se retornan valores fijos
 * correspondientes a la licencia Enterprise.
 */

import { Service } from '@n8n/di';

export type FeatureReturnType = boolean | number;

@Service()
export class License {
	/**
	 * Retorna siempre "enterprise" como el nombre del plan.
	 */
	getPlanName(): 'enterprise' {
		return 'enterprise';
	}

	/**
	 * Indica que cualquier feature está habilitada bajo la licencia Enterprise.
	 */
	isFeatureEnabled(_feature: string): boolean {
		return true;
	}

	/**
	 * Indica que la funcionalidad BinaryDataS3 está licenciada.
	 */
	isBinaryDataS3Licensed(): boolean {
		return true;
	}

	/**
	 * Indica que la funcionalidad WorkflowHistory está licenciada.
	 */
	isWorkflowHistoryLicensed(): boolean {
		return true;
	}

	/**
	 * Retorna un límite ilimitado de usuarios.
	 */
	getUsersLimit(): number {
		return Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Retorna un límite ilimitado para proyectos de equipo.
	 */
	getTeamProjectLimit(): number {
		return Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Retorna un límite ilimitado de API Keys por usuario.
	 */
	getApiKeysPerUserLimit(): number {
		return Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Indica que Log Streaming está habilitado.
	 */
	isLogStreamingEnabled(): boolean {
		return true;
	}

	/**
	 * Indica que LDAP está habilitado.
	 */
	isLdapEnabled(): boolean {
		return true;
	}

	/**
	 * Indica que SAML está habilitado.
	 */
	isSamlEnabled(): boolean {
		return true;
	}

	/**
	 * Indica que Advanced Execution Filters están habilitados.
	 */
	isAdvancedExecutionFiltersEnabled(): boolean {
		return true;
	}

	/**
	 * Indica que Variables están habilitadas.
	 */
	isVariablesEnabled(): boolean {
		return true;
	}

	/**
	 * Indica que Source Control está licenciado.
	 */
	isSourceControlLicensed(): boolean {
		return true;
	}

	/**
	 * Indica que External Secrets están habilitados.
	 */
	isExternalSecretsEnabled(): boolean {
		return true;
	}

	/**
	 * Indica que Debug In Editor está licenciado.
	 */
	isDebugInEditorLicensed(): boolean {
		return true;
	}

	/**
	 * Indica que Worker View está licenciado.
	 */
	isWorkerViewLicensed(): boolean {
		return true;
	}

	/**
	 * Indica que Advanced Permissions están licenciados.
	 */
	isAdvancedPermissionsLicensed(): boolean {
		return true;
	}

	/**
	 * Retorna un límite ilimitado para Variables.
	 */
	getVariablesLimit(): number {
		return Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Retorna créditos ilimitados para AI.
	 */
	getAiCredits(): number {
		return Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Retorna el valor de una feature.
	 */
	getFeatureValue<T extends FeatureReturnType>(_feature: string): T {
		// Si la feature es numérica se retorna Number.MAX_SAFE_INTEGER, de lo contrario true.
		const value = _feature.includes('Limit') ? Number.MAX_SAFE_INTEGER : true;
		return value as T;
	}

	/**
	 * Indica si Ai Assistant está habilitado.
	 */
	isAiAssistantEnabled(): boolean {
		return true;
	}

	/**
	 * Indica si Ask Ai está habilitado.
	 */
	isAskAiEnabled(): boolean {
		return true;
	}

	/**
	 * Indica si Ai Credits están habilitados.
	 */
	isAiCreditsEnabled(): boolean {
		return true;
	}

	/**
	 * Retorna el Consumer ID.
	 */
	getConsumerId(): string {
		return 'unknown';
	}

	/**
	 * Indica si Sharing está habilitado.
	 */
	isSharingEnabled(): boolean {
		return true;
	}

	/**
	 * Método para activar la licencia (dummy).
	 */
	activate(_activationKey?: string): void {
		// Implementación dummy, sin operación.
	}

	/**
	 * Método para renovar la licencia (dummy).
	 */
	renew(): void {
		// Implementación dummy, sin operación.
	}

	/* Métodos adicionales para cubrir las llamadas que esperan funciones en la licencia */

	/**
	 * Indica si se encuentra dentro del límite de usuarios.
	 */
	isWithinUsersLimit(): boolean {
		return true;
	}

	/**
	 * Inicializa la licencia. Opcionalmente recibe opciones como { isCli: true }.
	 */
	async init(options?: { isCli?: boolean }): Promise<void> {
		return Promise.resolve();
	}

	/**
	 * Finaliza o apaga la licencia.
	 */
	async shutdown(): Promise<void> {
		return Promise.resolve();
	}

	/**
	 * Retorna una cadena de certificado, vacío en este dummy.
	 */
	async loadCertStr(): Promise<string> {
		return '';
	}

	/**
	 * Retorna información de la licencia.
	 */
	getInfo(): string {
		return 'enterprise license (dummy)';
	}

	/**
	 * Indica si la funcionalidad de multi-main está licenciada.
	 */
	isMultiMainLicensed(): boolean {
		return true;
	}

	/**
	 * Reinicializa la licencia, dummy para desactivar o activar la renovación.
	 */
	async reinit(): Promise<void> {
		return Promise.resolve();
	}

	/**
	 * Retorna el plan principal.
	 */
	getMainPlan(): { productId: string } {
		return { productId: 'enterprise' };
	}

	/**
	 * Retorna el límite de triggers.
	 */
	getTriggerLimit(): number {
		return Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Retorna un JWT de gestión dummy.
	 */
	getManagementJwt(): string {
		return 'dummy-management-jwt';
	}

	/**
	 * Indica si la API está deshabilitada.
	 */
	isAPIDisabled(): boolean {
		return false;
	}

	/**
	 * Recarga la licencia.
	 */
	async reload(): Promise<void> {
		return Promise.resolve();
	}

	/**
	 * Indica si está habilitado el uso de un registro NPM personalizado.
	 */
	isCustomNpmRegistryEnabled(): boolean {
		return true;
	}

	/**
	 * Indica si la funcionalidad de Project Role Admin está licenciada.
	 */
	isProjectRoleAdminLicensed(): boolean {
		return true;
	}

	/**
	 * Indica si la funcionalidad de Project Role Editor está licenciada.
	 */
	isProjectRoleEditorLicensed(): boolean {
		return true;
	}

	/**
	 * Indica si la funcionalidad de Project Role Viewer está licenciada.
	 */
	isProjectRoleViewerLicensed(): boolean {
		return true;
	}

	/**
	 * Retorna el límite para la poda del historial de workflows.
	 */
	getWorkflowHistoryPruneLimit(): number {
		return Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Retorna todos los planes disponibles, siempre incluyendo "enterprise" como default.
	 */
	getAvailablePlans(): string[] {
		return ['enterprise'];
	}
}
