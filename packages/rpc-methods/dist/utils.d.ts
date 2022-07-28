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
export declare function selectHooks<Hooks extends Record<string, unknown>, HookName extends keyof Hooks>(hooks: Hooks, hookNames?: Record<HookName, boolean>): Pick<Hooks, HookName> | undefined;
