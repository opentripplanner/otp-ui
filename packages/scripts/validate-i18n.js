/* eslint-disable no-console */
/**
 * This script checks that message ids gathered by the formatjs extract command
 * are present in the files in the i18n subfolders.
 */
// Example usage for one package:
//   node ./validate-i18n.js ../trip-details/src/{,**/}*.{j,t}s{,x} ../trip-details/i18n/*.yml
// Example usage for all packages:
//   node ./validate-i18n.js ../**/src/{,**/}*.{j,t}s{,x} ../**/i18n/*.yml

const fs = require("fs").promises;
const path = require("path");
// const yargs = require("yargs/yargs");
const { load } = require("js-yaml");
const { extract } = require("@formatjs/cli");
const flatten = require("flat");

/**
 * Load yaml from a file into a js object
 */
async function loadYamlFile(filename) {
  return load(await fs.readFile(filename));
}

/**
 * Checks message ids completeness between code and yml files for all locales in repo.
 */
async function checkI18n({ sourceFiles, ymlFilesByLocale }) {
  // const yargsCli = yargs
  //  .scriptName("validate-i18n")
  // .usage(" ../trip-details/src/{,**/}*.{j,t}s{,x} ../trip-details/i18n/*.yml")
  /*
    .demandCommand(1, 1, 'Must provide directory of config files for OTP deployment (e.g., ./deploy.js trimet/)')
    .option('install', {
      default: 'true',
      description: 'skip installation of node_modules',
      type: 'boolean'
    })
    */
  //  .help();
  // const args = yargsCli.argv;
  // Get config folder from single non-hyphenated arg.
  // const configFolder = yargsCli.argv._[0];

  // Filter out glob patterns, private (/__) folders, and .d.ts types-only files.
  sourceFiles = sourceFiles.filter(
    f => !f.includes("*") && !f.includes("/__") && !f.endsWith(".d.ts")
  );

  // Gather message ids from code.
  const messagesFromCode = JSON.parse(await extract(sourceFiles, {}));
  const messageIdsFromCode = Object.keys(messagesFromCode);
  let errorCount = 0;

  // For each locale, check that all ids in messages are in the yml files.
  // Accessorily, log message ids from yml files that are not used in the code.
  Object.keys(ymlFilesByLocale).forEach(async locale => {
    const idsChecked = [];
    const idsNotInCode = [];

    const allI18nPromises = ymlFilesByLocale[locale].map(loadYamlFile);
    const allI18nMessages = await Promise.all(allI18nPromises);

    allI18nMessages.forEach(i18nMessages => {
      const flattenedMessages = flatten(i18nMessages);

      // Message ids from code must be present in yml.
      messageIdsFromCode.forEach(id => {
        if (flattenedMessages[id]) {
          idsChecked.push(id);
        }
      });

      // Message ids from yml must be present in code.
      Object.keys(flattenedMessages).forEach(id => {
        if (!messageIdsFromCode.includes(id)) {
          idsNotInCode.push(id);
        }
      });
    });

    // Collect ids in code not found in yml.
    const missingIdsForLocale = messageIdsFromCode.filter(
      id => !idsChecked.includes(id)
    );

    // Print errors.
    missingIdsForLocale.forEach(id => {
      console.error(`Message '${id}' is missing from locale ${locale}.`);
    });
    idsNotInCode.forEach(id => {
      console.error(
        `Message '${id}' from locale ${locale} is not used in code.`
      );
    });
    errorCount += missingIdsForLocale.length + idsNotInCode.length;
  });

  console.log(`There were ${errorCount} error(s).`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

/**
 * Helper function that sorts yml and source files into two buckets.
 * @returns A composite object with a list for yml files, and a list for source files.
 */
function sortSourceAndYmlFiles() {
  const sourceFiles = [];
  const ymlFilesByLocale = {};

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    const parsedArg = path.parse(arg);
    if (parsedArg.ext === ".yml") {
      const locale = parsedArg.name;
      if (!ymlFilesByLocale[locale]) {
        ymlFilesByLocale[locale] = [];
      }
      ymlFilesByLocale[locale].push(arg);
    } else {
      sourceFiles.push(arg);
    }
  }

  return {
    sourceFiles,
    ymlFilesByLocale
  };
}

checkI18n(sortSourceAndYmlFiles());
