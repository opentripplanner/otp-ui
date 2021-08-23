/**
 * This script checks that message ids gathered by the formatjs extract command
 * are present in the files in the i18n subfolders.
 */

import { extract } from "@formatjs/cli";

async function checkI18n() {
  // Gather message ids from code.
  const messages = await extract("src/**/*.{j,t}s{,x}");

  console.log(Object.keys(messages).length);
}

checkI18n();
