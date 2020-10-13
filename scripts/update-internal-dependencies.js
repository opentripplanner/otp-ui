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
  console.log("Updating all internal @opentripplanner dependencies");
}

/**
 * Updates all internal @opentripplanner/* dependencies in each package's
 * package.json to the latest version.
 */
async function main() {
  // iterate through all packages to build up dependency tree
  const packages = await fs.readdir("./packages");
  // create a lookup of parsed package.json files organized by package name
  const pkgLookup = {};
  await Promise.all(
    packages.map(async pkg => {
      // skip paths that aren't directories
      if ((await fs.stat(`./packages/${pkg}`)).isDirectory()) {
        pkgLookup[pkg] = JSON.parse(
          await fs.readFile(`./packages/${pkg}/package.json`)
        );
      }
    })
  );
  // iterate again and replace all internal package dependencies that have a
  // newer @opentripplanner dependency
  await Promise.all(
    Object.keys(pkgLookup).map(async pkg => {
      // iterate through lines of package.json and update dependencies as needed
      const newPackageJsonLines = [];
      const pkgPackageJsonFile = `./packages/${pkg}/package.json`;

      // read package's package.json file line-by-line
      const pkgContents = await fs.readFile(pkgPackageJsonFile, "UTF-8");
      pkgContents.split("\n").forEach(line => {
        // try to find a match of an internal dependency
        const match = line.match(
          /\s*"@opentripplanner\/([\w-]*)": "\^?([\d.]*)"/
        );
        if (match) {
          // match found, check if the internal dependency has a more recent
          // version
          const internalPackage = match[1];
          const internalDependencyPackageVersion = match[2];
          const latestPackageVersion = pkgLookup[internalPackage].version;
          if (
            // check if there are any filtered packages. If not, then update all
            // applicable dependencies, otherwise, only update those listed in
            // the cli args
            (filteredPackages.length === 0 ||
              filteredPackages.indexOf(pkg) > -1) &&
            semver.lt(internalDependencyPackageVersion, latestPackageVersion)
          ) {
            // a more recent version exists, update line in the package.json
            // file
            line = line.replace(
              internalDependencyPackageVersion,
              latestPackageVersion
            );
          }
        }
        newPackageJsonLines.push(line);
      });

      // write updated file contents
      await fs.writeFile(pkgPackageJsonFile, newPackageJsonLines.join("\n"));
    })
  );
}

main();
