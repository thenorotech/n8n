import { z } from 'zod';

export const bannerNameSchema = z.enum(['V1', 'TRIAL_OVER', 'TRIAL', 'EMAIL_CONFIRMATION']);

export type BannerName = z.infer<typeof bannerNameSchema>;
