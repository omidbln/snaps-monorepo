"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapValidationFailureReason = exports.NpmSnapFileNames = exports.SnapIdPrefixes = void 0;
var SnapIdPrefixes;
(function (SnapIdPrefixes) {
    SnapIdPrefixes["npm"] = "npm:";
    SnapIdPrefixes["local"] = "local:";
})(SnapIdPrefixes = exports.SnapIdPrefixes || (exports.SnapIdPrefixes = {}));
var NpmSnapFileNames;
(function (NpmSnapFileNames) {
    NpmSnapFileNames["PackageJson"] = "package.json";
    NpmSnapFileNames["Manifest"] = "snap.manifest.json";
})(NpmSnapFileNames = exports.NpmSnapFileNames || (exports.NpmSnapFileNames = {}));
/**
 * Snap validation failure reason codes that are programmatically fixable
 * if validation occurs during development.
 */
var SnapValidationFailureReason;
(function (SnapValidationFailureReason) {
    SnapValidationFailureReason["NameMismatch"] = "\"name\" field mismatch";
    SnapValidationFailureReason["VersionMismatch"] = "\"version\" field mismatch";
    SnapValidationFailureReason["RepositoryMismatch"] = "\"repository\" field mismatch";
    SnapValidationFailureReason["ShasumMismatch"] = "\"shasum\" field mismatch";
})(SnapValidationFailureReason = exports.SnapValidationFailureReason || (exports.SnapValidationFailureReason = {}));
//# sourceMappingURL=types.js.map