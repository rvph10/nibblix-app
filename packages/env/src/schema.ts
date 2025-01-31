import { z } from 'zod';

/**
 * Base environment schema for both client and server
 */
const baseEnvSchema = z.object({
  ENV: z.enum(['local', 'development', 'staging', 'production']),

  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  
  // Authentication
  AUTH_COOKIE_NAME: z.string().default('nix-auth'),
  AUTH_COOKIE_LIFETIME: z.coerce.number().default(60 * 60 * 24 * 7),
  
  // API Configuration
  CORS_ORIGINS: z.string().transform(val => val.split(',')),
  
  // Redis
  REDIS_URL: z.string().url(),
  
  // External Services
  // STRIPE_SECRET_KEY: z.string().min(1), // not used for now
  // STRIPE_WEBHOOK_SECRET: z.string().min(1), // not used for now
  
  // Deployment // Need to develop more before 
  // VERCEL_TOKEN: z.string().optional(), 
  // VERCEL_ORG_ID: z.string().optional(),
  // VERCEL_PROJECT_ID: z.string().optional(),
  // RAILWAY_TOKEN: z.string().optional(),
  // RAILWAY_SERVICE_ID: z.string().optional(),
});

/**
 * Validate environment variables
 */
export function validateEnv(env: Record<string, unknown>) {
  const parsed = baseEnvSchema.safeParse(env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}