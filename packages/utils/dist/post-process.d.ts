export declare type PostProcessOptions = {
    stripComments: boolean;
};
/**
 * Post process code with AST such that it can be evaluated in SES.
 *
 * Currently:
 * - Makes all direct calls to eval indirect.
 * - Handles certain Babel-related edge cases.
 * - Removes the `Buffer` provided by Browserify.
 * - Optionally removes comments.
 * - Breaks up tokens that would otherwise result in SES errors, such as HTML
 * comment tags `<!--` and `-->` and `import(n)` statements.
 *
 * @param code - The code to post process.
 * @param options - The post-process options.
 * @param options.stripComments - Whether to strip comments. Defaults to `true`.
 * @returns The modified code.
 */
export declare function postProcessBundle(code: string | null, { stripComments }?: Partial<PostProcessOptions>): string | null;
