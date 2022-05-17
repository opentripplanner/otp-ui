import { promises as fs } from "fs";
import { load } from "js-yaml";
import path from "path";

export interface SourceFilesAndYmlFilesByLocale {
  sourceFiles: string[];
  ymlFilesByLocale: Record<string, string>;
}

/**
 * Helper function that sorts yml and source files into two buckets.
 * @param argv The value from process.argv.
 * @returns A composite object with a list for yml files by locale, and a list for source files.
 */
export function sortSourceAndYmlFiles(
  argv: string[]
): SourceFilesAndYmlFilesByLocale {
  const sourceFiles = [];
  const ymlFilesByLocale = {};

  // Note: reminder that node.js provides the first two argv values:
  // - argv[0] is the name of the executable file.
  // - argv[1] is the path to the script file.
  // - argv[2] and beyond are the parameters passed to the script.
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (
      !arg.includes("*") &&
      !arg.includes("/__") &&
      !arg.includes("node_modules") &&
      !arg.endsWith(".d.ts")
    ) {
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
  }

  return {
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
