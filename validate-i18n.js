/* eslint-disable no-console */
/**
 * This script checks that message ids gathered by the formatjs extract command
 * are present in the files in the i18n subfolders.
 */
// Example usage for one package:
//    node ./validate-i18n.js packages/trip-details/src/{,**/}*.{j,t}s{,x} packages/trip-details/i18n/*.yml

const fs = require("fs-extra");
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
  // Filter out glob patterns and private (/__) folders.
  sourceFiles = sourceFiles.filter(f => !f.includes("*") && !f.includes("/__"));

  try {
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
  } catch (err) {
    console.error(err);
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
    if (arg.endsWith(".yml")) {
      const pathParts = arg.split(".yml")[0].split(/[\\|/]/);
      const locale = pathParts[pathParts.length - 1];
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
