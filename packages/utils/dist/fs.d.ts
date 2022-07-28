import { Json } from '@metamask/utils';
import { NpmSnapFileNames } from './types';
/**
 * Checks whether the given path string resolves to an existing directory, and
 * optionally creates the directory if it doesn't exist.
 *
 * @param pathString - The path string to check.
 * @param createDir - Whether to create the directory if it doesn't exist.
 * @returns Whether the given path is an existing directory.
 */
export declare function isDirectory(pathString: string, createDir: boolean): Promise<boolean>;
/**
 * Checks whether the given path string resolves to an existing file.
 *
 * @param pathString - The path string to check.
 * @returns Whether the given path is an existing file.
 */
export declare function isFile(pathString: string): Promise<boolean>;
/**
 * Reads a `.json` file, parses its contents, and returns them.
 *
 * @param pathString - The path to the JSON file.
 * @returns The parsed contents of the JSON file.
 */
export declare function readJsonFile<Type = Json>(pathString: string): Promise<Type>;
/**
 * Utility function for reading `package.json` or the Snap manifest file.
 * These are assumed to be in the current working directory.
 *
 * @param pathString - The base path of the file to read.
 * @param snapJsonFileName - The name of the file to read.
 * @returns The parsed JSON file.
 */
export declare function readSnapJsonFile(pathString: string, snapJsonFileName: NpmSnapFileNames): Promise<Json>;
