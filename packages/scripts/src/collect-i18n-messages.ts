/* eslint-disable no-console */
/**
 * This script collects all i18n messages and create a formatted output.
 */

import { extract } from "@formatjs/cli";
import flatten from "flat";

import { loadYamlFile, sortSourceAndYmlFiles } from "./util";

/**
 * Collect all messages and create a formatted output.
 */
async function collectAndPrintOutMessages({ sourceFiles, ymlFilesByLocale }) {
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
      const flattenedMessages: Record<string, string> = flatten(i18nMessages);
      allI18nMessagesFlattened = {
        ...allI18nMessagesFlattened,
        ...flattenedMessages
      };
    });

    // CSV heading
    console.log(`ID,Description,${locale}`);
    messageIdsFromCode.forEach(id => {
      const { description } = messagesFromCode[id];
      const message = allI18nMessagesFlattened[id].trim();
      console.log(`${id},"${description}","${message}"`);
    });
  });
}

collectAndPrintOutMessages(sortSourceAndYmlFiles(process.argv));
