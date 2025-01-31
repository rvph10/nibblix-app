import { execSync } from 'child_process';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

interface PackageJson {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

function getLatestVersion(packageName: string): string {
  try {
    const output = execSync(`pnpm info ${packageName} version`, {
      encoding: 'utf8',
    });
    return output.trim();
  } catch (error) {
    console.error(`Failed to fetch latest version for ${packageName}`);
    return null;
  }
}

function checkPackageVersions(packageJsonPath: string) {
  const content = readFileSync(packageJsonPath, 'utf8');
  const pkg: PackageJson = JSON.parse(content);
  const outdatedDeps: Array<{ name: string; current: string; latest: string }> =
    [];

  console.log(`\nChecking ${pkg.name}...`);

  const checkDependencies = (deps: Record<string, string>, type: string) => {
    if (!deps) return;

    Object.entries(deps).forEach(([name, version]) => {
      // Skip workspace dependencies
      if (version.startsWith('workspace:')) return;

      const latest = getLatestVersion(name);
      if (latest && version.replace(/[\^~]/, '') !== latest) {
        outdatedDeps.push({
          name,
          current: version,
          latest: latest,
        });
      }
    });
  };

  checkDependencies(pkg.dependencies, 'dependencies');
  checkDependencies(pkg.devDependencies, 'devDependencies');
  checkDependencies(pkg.peerDependencies, 'peerDependencies');

  if (outdatedDeps.length > 0) {
    console.log('\nOutdated dependencies found:');
    outdatedDeps.forEach(({ name, current, latest }) => {
      console.log(`  ${name}: ${current} → ${latest}`);
    });
  } else {
    console.log('All dependencies are up to date!');
  }

  return outdatedDeps;
}

function getAllPackageJsonPaths() {
  const workspaceInfo = execSync('pnpm recursive list --json', {
    encoding: 'utf8',
  });
  const packages = JSON.parse(workspaceInfo);

  return packages.map((pkg: { path: string }) =>
    resolve(pkg.path, 'package.json')
  );
}

// Main execution
console.log('Checking all packages for outdated dependencies...');

const packagePaths = getAllPackageJsonPaths();
let hasOutdated = false;

packagePaths.forEach((packagePath) => {
  const outdated = checkPackageVersions(packagePath);
  if (outdated.length > 0) hasOutdated = true;
});

if (hasOutdated) {
  console.log('\nTo update all dependencies to their latest versions, run:');
  console.log('pnpm update --latest --recursive');
  process.exit(1);
} else {
  console.log('\nAll packages are using their latest stable versions!');
  process.exit(0);
}
