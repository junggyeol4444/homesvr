import { z } from 'zod';

const nodeEnvValues = ['development', 'test', 'production'] as const;

type NodeEnv = (typeof nodeEnvValues)[number];

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(nodeEnvValues).default('development'),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  PORT: z.coerce.number().default(8080),
  POSTHOG_API_KEY: z.string().min(1),
  POSTHOG_HOST: z.string().url(),
  GA4_MEASUREMENT_ID: z.string().min(1),
  GA4_API_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().optional(),
  SLACK_WEBHOOK_URL: z.string().url().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
  PRICE_ALERT_SALT: z.string().min(8),
  KMS_KEYRING: z.string().optional(),
  KMS_KEY: z.string().optional(),
  PARTNER_LINK_BASE: z.string().url().optional()
});

export const webEnvSchema = z.object({
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
  NEXT_PUBLIC_GA4_ID: z.string().min(1),
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_PRICE_DISCLAIMER: z.string().default('가격 정보는 제공 시점 기준입니다.')
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type WebEnv = z.infer<typeof webEnvSchema>;

export const validateServerEnv = (env: NodeJS.ProcessEnv): ServerEnv => {
  return serverEnvSchema.parse(env);
};

export const validateWebEnv = (env: NodeJS.ProcessEnv): WebEnv => {
  return webEnvSchema.parse(env);
};

export const resolveNodeEnv = (env: NodeJS.ProcessEnv): NodeEnv => {
  return (env.NODE_ENV as NodeEnv) ?? 'development';
};
