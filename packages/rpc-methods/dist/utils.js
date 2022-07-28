"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectHooks = void 0;
/**
 * Returns the subset of the specified `hooks` that are included in the
 * `hookNames` object. This is a Principle of Least Authority (POLA) measure
 * to ensure that each RPC method implementation only has access to the
 * API "hooks" it needs to do its job.
 *
 * @param hooks - The hooks to select from.
 * @param hookNames - The names of the hooks to select.
 * @returns The selected hooks.
 * @template Hooks - The hooks to select from.
 * @template HookName - The names of the hooks to select.
 */
function selectHooks(hooks, hookNames) {
    if (hookNames) {
        return Object.keys(hookNames).reduce((hookSubset, _hookName) => {
            const hookName = _hookName;
            hookSubset[hookName] = hooks[hookName];
            return hookSubset;
        }, {});
    }
    return undefined;
}
exports.selectHooks = selectHooks;
//# sourceMappingURL=utils.js.map