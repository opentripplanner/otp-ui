/* eslint-disable no-console */
/**
 * This script collects all i18n messages and create a formatted output.
 */

const fs = require("fs").promises;
const path = require("path");
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
 * Collect all messages and create a formatted output.
 */
async function collectAndPrintOutMessages({ sourceFiles, ymlFilesByLocale }) {
  // Filter out glob patterns, private (/__) folders, and .d.ts types-only files.
  sourceFiles = sourceFiles.filter(
    f => !f.includes("*") && !f.includes("/__") && !f.endsWith(".d.ts")
  );

  // Gather message ids from code.
  const messagesFromCode = JSON.parse(await extract(sourceFiles, {}));
  const messageIdsFromCode = Object.keys(messagesFromCode);

  // For each locale, check that all ids in messages are in the yml files.
  // Accessorily, log message ids from yml files that are not used in the code.
  Object.keys(ymlFilesByLocale).forEach(async locale => {
    const allI18nPromises = ymlFilesByLocale[locale].map(loadYamlFile);
    const allI18nMessages = await Promise.all(allI18nPromises);
    let allI18nMessagesFlattened = {};

    allI18nMessages.forEach(i18nMessages => {
      const flattenedMessages = flatten(i18nMessages);
      allI18nMessagesFlattened = {
        ...allI18nMessagesFlattened,
        ...flattenedMessages
      };
    });

    // CSV heading
    console.log(`ID,Description,${locale}`);
    messageIdsFromCode.forEach(id => {
      const { description } = messagesFromCode[id];
      console.log(`${id},"${description}","${allI18nMessagesFlattened[id]}"`);
    });
  });
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

collectAndPrintOutMessages(sortSourceAndYmlFiles());
