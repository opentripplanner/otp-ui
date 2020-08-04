const fs = require("fs").promises;

const semver = require("semver");

// get cli arguments. Any cli argument is assumbed to be the name of a package
// dependency to update in other packages. If no extra cli arguments are
// provided, then all packages will be updated.
//
// For example:
//   `yarn update-internal-dependencies`
//      updates everything
//   `yarn update-internal-dependencies core-utils base-map`
//      updates packages that depend on either @opentripplanner/core-utils or
//      @opentripplanner/base-map
const filteredPackages = process.argv.slice(2);
if (filteredPackages.length === 0) {
  console.log("Updating all internal @opentripplanner dependencies!");
}

function shouldUpdatePackage(pkg) {
  if (filteredPackages.length === 0) return true;
  return filteredPackages.indexOf(pkg) > -1;
}

/**
 * Updates all internal @opentripplanner/* dependencies in each package's
 * package.json to the latest version.
 */
async function main() {
  // iterate through all packages to build up dependency tree
  const packages = await fs.readdir("./packages");
  const pkgLookup = {};
  await Promise.all(
    packages.map(async pkg => {
      // skip paths that aren't directories
      if (!(await fs.stat(`./packages/${pkg}`)).isDirectory()) return;
      pkgLookup[pkg] = JSON.parse(
        await fs.readFile(`./packages/${pkg}/package.json`)
      );
    })
  );
  // iterate again and replace all internal package dependencies that have a
  // newer @opentripplanner dependency
  await Promise.all(
    Object.keys(pkgLookup).map(async pkg => {
      // iterate through lines of package.json and update dependencies as needed
      const newPackageJsonLines = [];
      const pkgPackageJsonFile = `./packages/${pkg}/package.json`;
      const pkgContents = await fs.readFile(pkgPackageJsonFile, "UTF-8");
      pkgContents.split("\n").forEach(line => {
        const match = line.match(
          /\s*"@opentripplanner\/([\w-]*)": "\^?([\d.]*)"/
        );
        if (match) {
          const internalPackage = match[1];
          const internalDependencyPackageVersion = match[2];
          const latestPackageVersion = pkgLookup[internalPackage].version;
          if (
            shouldUpdatePackage(internalPackage) &&
            semver.lt(internalDependencyPackageVersion, latestPackageVersion)
          ) {
            line = line.replace(
              internalDependencyPackageVersion,
              latestPackageVersion
            );
          }
        }
        newPackageJsonLines.push(line);
      });
      await fs.writeFile(pkgPackageJsonFile, newPackageJsonLines.join("\n"));
    })
  );
}

main();
