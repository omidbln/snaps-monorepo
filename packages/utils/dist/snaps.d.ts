import { SnapManifest } from './json-schemas';
import { SnapIdPrefixes, SnapValidationFailureReason } from './types';
export declare const LOCALHOST_HOSTNAMES: Set<string>;
export declare const SNAP_PREFIX = "wallet_snap_";
export declare const PROPOSED_NAME_REGEX: RegExp;
/**
 * An error indicating that a Snap validation failure is programmatically
 * fixable during development.
 */
export declare class ProgrammaticallyFixableSnapError extends Error {
    reason: SnapValidationFailureReason;
    constructor(message: string, reason: SnapValidationFailureReason);
}
/**
 * Calculates the Base64-encoded SHA-256 digest of a Snap source code string.
 *
 * @param sourceCode - The UTF-8 string source code of a Snap.
 * @returns The Base64-encoded SHA-256 digest of the source code.
 */
export declare function getSnapSourceShasum(sourceCode: string): string;
export declare type ValidatedSnapId = `local:${string}` | `npm:${string}`;
/**
 * Checks whether the `source.shasum` property of a Snap manifest matches the
 * shasum of a snap source code string.
 *
 * @param manifest - The manifest whose shasum to validate.
 * @param sourceCode - The source code of the snap.
 * @param errorMessage - The error message to throw if validation fails.
 */
export declare function validateSnapShasum(manifest: SnapManifest, sourceCode: string, errorMessage?: string): void;
/**
 * Extracts the snap prefix from a snap ID.
 *
 * @param snapId - The snap ID to extract the prefix from.
 * @returns The snap prefix from a snap id, e.g. `npm:`.
 */
export declare function getSnapPrefix(snapId: string): SnapIdPrefixes;
/**
 * Computes the permission name of a snap from its snap ID.
 *
 * @param snapId - The snap ID.
 * @returns The permission name corresponding to the given snap ID.
 */
export declare function getSnapPermissionName(snapId: string): string;
