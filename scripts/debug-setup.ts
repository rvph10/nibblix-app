// File: scripts/debug-setup.ts
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function checkDirectory(dir: string): boolean {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

function checkFile(file: string): boolean {
  return fs.existsSync(file) && fs.statSync(file).isFile();
}

function validatePackage(packagePath: string) {
  console.log(`\nValidating package: ${packagePath}`);

  if (!checkDirectory(packagePath)) {
    console.error(`❌ Directory ${packagePath} does not exist`);
    return false;
  }

  const packageJsonPath = path.join(packagePath, 'package.json');
  if (!checkFile(packageJsonPath)) {
    console.error(`❌ package.json not found in ${packagePath}`);
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`✅ Found package: ${packageJson.name}@${packageJson.version}`);
    return true;
  } catch (error) {
    console.error(`❌ Error parsing package.json in ${packagePath}:`, error);
    return false;
  }
}

function validateEslintConfig() {
  const eslintConfigPath = path.join(process.cwd(), 'packages/eslint-config');
  console.log('\n=== Validating ESLint Config Package ===');

  // Check main package files
  const requiredFiles = [
    'package.json',
    'index.js',
    'next.js',
    'react.js',
    'nest.js',
  ];

  let isValid = true;
  for (const file of requiredFiles) {
    const filePath = path.join(eslintConfigPath, file);
    if (!checkFile(filePath)) {
      console.error(`❌ Missing required file: ${file}`);
      isValid = false;
    } else {
      console.log(`✅ Found required file: ${file}`);
    }
  }

  return isValid;
}

function validateWorkspace() {
  console.log('\n=== Validating Workspace Setup ===');

  // Check root workspace files
  const rootFiles = ['package.json', 'pnpm-workspace.yaml'];
  let isValid = true;

  for (const file of rootFiles) {
    if (!checkFile(file)) {
      console.error(`❌ Missing root file: ${file}`);
      isValid = false;
    } else {
      console.log(`✅ Found root file: ${file}`);
    }
  }

  // Validate all packages
  const packages = [
    'packages/eslint-config',
    'packages/env',
    'packages/typescript-config',
    'packages/ui',
    'apps/web',
    'apps/api',
  ];

  for (const pkg of packages) {
    if (!validatePackage(pkg)) {
      isValid = false;
    }
  }

  return isValid;
}

function validateDependencies() {
  console.log('\n=== Validating Dependencies ===');

  try {
    // Read root package.json
    const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const webPackage = JSON.parse(
      fs.readFileSync('apps/web/package.json', 'utf8')
    );

    // Check if @nibblix/eslint-config is correctly referenced
    const eslintDep =
      webPackage.dependencies?.['@nibblix/eslint-config'] ||
      webPackage.devDependencies?.['@nibblix/eslint-config'];

    if (!eslintDep) {
      console.error(
        '❌ @nibblix/eslint-config not found in web package dependencies'
      );
      return false;
    }

    if (eslintDep !== 'workspace:*') {
      console.error(
        `❌ Incorrect @nibblix/eslint-config version: ${eslintDep}. Should be "workspace:*"`
      );
      return false;
    }

    console.log('✅ Dependencies are correctly configured');
    return true;
  } catch (error) {
    console.error('❌ Error validating dependencies:', error);
    return false;
  }
}

console.log('Starting setup validation...\n');

const isWorkspaceValid = validateWorkspace();
const isEslintConfigValid = validateEslintConfig();
const areDependenciesValid = validateDependencies();

if (isWorkspaceValid && isEslintConfigValid && areDependenciesValid) {
  console.log('\n✅ All validations passed! Your setup looks correct.');
} else {
  console.error(
    '\n❌ Some validations failed. Please fix the issues above and try again.'
  );
  process.exit(1);
}
