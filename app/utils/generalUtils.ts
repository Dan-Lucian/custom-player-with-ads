import { IEventListener } from 'interfaces/IEventListener';

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

/**
 * Determines if a URL is of IMA format.
 * @param {string} url url.
 * @returns {boolean} true if URL is of IMA format.
 */
export function isImaUrl(url: string): boolean {
    return url.includes('pubads.g.doubleclick.net');
}

/**
 * Registers all event liseners from a IEventListener array.
 * @param {IEventListener[]} array array.
 */
export function addEventListenersUsingArray(array: IEventListener[]): void {
    array.forEach(({ element, event, callback }) => {
        element.addEventListener(event, callback);
    });
}

/**
 * Unregisters all event liseners from a IEventListener array.
 * @param {IEventListener[]} array array.
 */
export function removeEventListenersUsingArray(array: IEventListener[]): void {
    array.forEach(({ element, event, callback }) => {
        element.removeEventListener(event, callback);
    });
}

/**
 * @param {string} HTML representing a single element
 * @return {HTMLElement}
 */
export function htmlToElement(html: string): HTMLElement {
    const template = document.createElement('template');
    const newHtml = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = newHtml;

    return template.content.firstChild as HTMLElement;
}
