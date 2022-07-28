"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSnapJsonFile = exports.readJsonFile = exports.isFile = exports.isDirectory = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
/**
 * Checks whether the given path string resolves to an existing directory, and
 * optionally creates the directory if it doesn't exist.
 *
 * @param pathString - The path string to check.
 * @param createDir - Whether to create the directory if it doesn't exist.
 * @returns Whether the given path is an existing directory.
 */
async function isDirectory(pathString, createDir) {
    try {
        const stats = await fs_1.promises.stat(pathString);
        return stats.isDirectory();
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            if (!createDir) {
                return false;
            }
            await fs_1.promises.mkdir(pathString);
            return true;
        }
        return false;
    }
}
exports.isDirectory = isDirectory;
/**
 * Checks whether the given path string resolves to an existing file.
 *
 * @param pathString - The path string to check.
 * @returns Whether the given path is an existing file.
 */
async function isFile(pathString) {
    try {
        const stats = await fs_1.promises.stat(pathString);
        return stats.isFile();
    }
    catch (error) {
        return false;
    }
}
exports.isFile = isFile;
/**
 * Reads a `.json` file, parses its contents, and returns them.
 *
 * @param pathString - The path to the JSON file.
 * @returns The parsed contents of the JSON file.
 */
async function readJsonFile(pathString) {
    if (!pathString.endsWith('.json')) {
        throw new Error('The specified file must be a ".json" file.');
    }
    return JSON.parse(await fs_1.promises.readFile(pathString, 'utf8'));
}
exports.readJsonFile = readJsonFile;
/**
 * Utility function for reading `package.json` or the Snap manifest file.
 * These are assumed to be in the current working directory.
 *
 * @param pathString - The base path of the file to read.
 * @param snapJsonFileName - The name of the file to read.
 * @returns The parsed JSON file.
 */
async function readSnapJsonFile(pathString, snapJsonFileName) {
    const path = path_1.default.join(pathString, snapJsonFileName);
    try {
        return await readJsonFile(path);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error(`Could not find '${path}'. Please ensure that the file exists.`);
        }
        throw error;
    }
}
exports.readSnapJsonFile = readSnapJsonFile;
//# sourceMappingURL=fs.js.map