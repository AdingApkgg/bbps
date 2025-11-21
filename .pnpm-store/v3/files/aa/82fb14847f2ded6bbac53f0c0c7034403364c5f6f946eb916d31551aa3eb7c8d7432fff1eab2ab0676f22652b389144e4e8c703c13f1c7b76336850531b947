/**
 * Searches a directory looking for matching files. This uses the config
 * array's logic to determine if a directory or file should be ignored.
 *
 * Derived from {@link https://github.com/eslint/eslint/blob/d2d06f7a70d9b96b125ecf2de8951bea549db4da/lib/eslint/eslint-helpers.js#L217-L382|ESLint globSearch()}
 *
 * @param {Object} options The options for this function.
 * @param {string} options.basePath The directory to search.
 * @param {import('@eslint/config-array').ConfigArray} options.configs The config array to use for determining what to ignore.
 * @param {import('@nodelib/fs.walk').DeepFilterFunction} [options.deepFilter] Optional function that indicates whether the directory will be read deep or not.
 * @param {import('@nodelib/fs.walk').EntryFilterFunction} [options.entryFilter] Optional function that indicates whether the entry will be included to results or not.
 * @returns {Promise<Array<string>>} An array of matching file paths or an empty array if there are no matches.
 */
export function configArrayFindFiles(options: {
    basePath: string;
    configs: import("@eslint/config-array").ConfigArray;
    deepFilter?: fswalk.DeepFilterFunction | undefined;
    entryFilter?: fswalk.EntryFilterFunction | undefined;
}): Promise<Array<string>>;
import fswalk from '@nodelib/fs.walk';
//# sourceMappingURL=index.d.ts.map