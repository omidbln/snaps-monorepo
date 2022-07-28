"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectHooks = exports.restrictedMethodPermissionBuilders = exports.permittedMethods = void 0;
var permitted_1 = require("./permitted");
Object.defineProperty(exports, "permittedMethods", { enumerable: true, get: function () { return permitted_1.handlers; } });
var restricted_1 = require("./restricted");
Object.defineProperty(exports, "restrictedMethodPermissionBuilders", { enumerable: true, get: function () { return restricted_1.builders; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "selectHooks", { enumerable: true, get: function () { return utils_1.selectHooks; } });
//# sourceMappingURL=index.js.map