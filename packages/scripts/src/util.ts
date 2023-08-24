import { promises as fs } from "fs";
import { load } from "js-yaml";
import glob from "glob-promise";
import path from "path";

export interface SourceFilesAndYmlFilesByLocale {
  exceptionFiles: string[];
  sourceFiles: string[];
  ymlFilesByLocale: Record<string, string[]>;
}

export function shouldProcessFile(fileName: string, folder: string): boolean {
  return (
    (!fileName.includes("/__") || folder.includes("/__")) &&
    !fileName.includes("node_modules") &&
    !fileName.endsWith(".d.ts")
  );
}

/**
 * @returns true if the id is not special or reserved (i.e. doesn't start with "_").
 */
export function isNotSpecialId(id: string): boolean {
  return !id.startsWith("_");
}

const exceptionFileName = "i18n-exceptions.json";

/**
 * Helper function that sorts yml, source, and exception files into different buckets.
 * @param argv The value from process.argv.
 * @returns A composite object with a list for yml files by locale, and a list for source files.
 */
export async function sortSourceAndYmlFiles(
  argv: string[]
): Promise<SourceFilesAndYmlFilesByLocale> {
  const sourceFiles = [];
  const ymlFilesByLocale = {};
  const exceptionFiles = [];

  // Places the given file into the source, yml, or ignoredId file bucket above.
  function sortFile(fileName: string): void {
    const parsedArg = path.parse(fileName);
    const baseName = parsedArg.name;
    if (parsedArg.base === exceptionFileName) {
      exceptionFiles.push(fileName);
    } else if (parsedArg.ext === ".json") {
      // Ignore other JSON files.
    } else if (parsedArg.ext === ".yml") {
      const locale = baseName;
      if (!ymlFilesByLocale[locale]) {
        ymlFilesByLocale[locale] = [];
      }
      const ymlFilesForLocale = ymlFilesByLocale[locale];
      if (!ymlFilesForLocale.includes(fileName)) {
        ymlFilesForLocale.push(fileName);
      }
      ymlFilesByLocale[locale].push(fileName);
    } else if (!sourceFiles.includes(fileName)) {
      sourceFiles.push(fileName);
    }
  }

  // Note: reminder that node.js provides the first two argv values:
  // - argv[0] is the name of the executable file.
  // - argv[1] is the path to the script file.
  // - argv[2] and beyond are the files and folders passed to the script.
  const allGlobPromises = [];
  const allGlobs = [];
  const allStatPromises = [];
  const allStatFiles = [];
  for (let i = 2; i < argv.length; i++) {
    // List the files recursively (glob) for this folder.
    const arg = argv[i];

    if (arg.endsWith(".yml")) {
      // If argument ends with .yml, treat as a file.
      sortFile(arg);
      // Also include any exception file in that folder, if it exists.
      const parsedArg = path.parse(arg);
      const exceptionFile = `${parsedArg.dir}/${exceptionFileName}`;
      allStatFiles.push(exceptionFile);
      allStatPromises.push(fs.stat(exceptionFile));
    } else {
      // Otherwise, it is a folder, and use glob to get files recursively.
      // For glob argument info, see their docs at https://github.com/ahmadnassri/node-glob-promise#api.
      allGlobs.push(arg);
      allGlobPromises.push(glob(`${arg}/**/*.{{j,t}s{,x},yml,json}`));
    }
  }

  const allStats = await Promise.allSettled(allStatPromises);
  allStats.forEach((stat, i) => {
    if (stat.status === "fulfilled") {
      sortFile(allStatFiles[i]);
    }
  });

  const allFileLists = await Promise.all(allGlobPromises);
  allFileLists.forEach((files, i) =>
    files.filter(f => shouldProcessFile(f, allGlobs[i])).forEach(sortFile)
  );

  return {
    exceptionFiles,
    sourceFiles,
    ymlFilesByLocale
  };
}

/**
 * Load yaml from a file into a js object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadYamlFile(filename: string): Promise<any> {
  return load(await fs.readFile(filename));
}

/**
 * Convert a groups object into a list of corresponding message ids.
 */
export function expandGroupIds(groups: Record<string, string[]>): string[] {
  return Object.keys(groups).reduce(
    (result, group) =>
      result.concat(groups[group].map(key => group.replace("*", key))),
    []
  );
}

interface CheckException {
  groups: Record<string, string[]>;
  ignoredIds: Set<string>;
}

/**
 * Combines exception files into a single exception object.
 */
export async function combineExceptionFiles(
  exceptionFiles: string[]
): Promise<CheckException> {
  let allIgnoredIds = [];
  const allGroups = [];
  await Promise.all(
    exceptionFiles.map(async file => {
      const rawJson = (await fs.readFile(file)).toString();
      const jsonObject = JSON.parse(rawJson);
      allIgnoredIds = allIgnoredIds.concat(jsonObject.ignoredIds);
      if (jsonObject.groups) {
        allGroups.push(jsonObject.groups);
      }
    })
  );
  const groups = allGroups.reduce(
    (result, group) => ({ ...result, ...group }),
    {}
  );
  return {
    groups,
    // Make sure ignored ids are unique
    ignoredIds: new Set(allIgnoredIds)
  };
}
