/**
 * Transforms template strings to a merged single string.
 * @param {TemplateStringsArray} strings array of strings return by the template strings.
 * @param {unkown} values array of values return by the template strings.
 * @returns {string} unified string with interpolated values.
 */
function assembleTemplateStrings(strings: TemplateStringsArray, values: unknown[]): string {
    let result = '';
    const max = Math.max(strings.length, values.length);

    for (let index = 0; index < max; index += 1) {
        result += String(strings[index]);

        if (index + 1 !== max) {
            result += String(values[index]);
        }
    }

    return result;
}

/**
 * Enable vscode css code recognition when using template strings with lit-plugin.
 * @param {TemplateStringsArray} strings array of strings return by the template strings.
 * @param {unkown} values array of values return by the template strings.
 * @returns {string} unified string with interpolated values.
 */
export function css(strings: TemplateStringsArray, ...values: unknown[]): string {
    return assembleTemplateStrings(strings, values);
}

/**
 * Enable vscode html code recognition when using template strings with lit-plugin.
 * @param {TemplateStringsArray} strings array of strings return by the template strings.
 * @param {unkown} values array of values return by the template strings.
 * @returns {string} unified string with interpolated values.
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
    return assembleTemplateStrings(strings, values);
}
