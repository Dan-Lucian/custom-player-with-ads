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

/**
 * Gets a random value from an array.
 * @param {T[]} array array of values.
 * @returns {T} random value.
 */
export function getRandomValueFromArray<T>(array: T[]): T {
    const min = 0;
    const max = array.length - 1;
    const intRandom = Math.floor(Math.random() * (max - min + 1)) + min;

    return array[intRandom];
}
