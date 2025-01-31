import { config } from 'dotenv';
import { resolve } from 'path';
import { validateEnv } from '@nibblix/env';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

try {
  // Validate project environment variables
  console.log('Validating environment variables...');
  validateEnv(process.env);
  console.log('✅ Project environment variables are valid');
  process.exit(0);
} catch (error) {
  console.error('❌ Environment validation failed');
  console.error(error);
  process.exit(1);
}
