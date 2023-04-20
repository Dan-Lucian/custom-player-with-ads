/* eslint-disable valid-typeof */
/* eslint-disable no-shadow */
enum JavaScriptTypeEnum {
    Undefined = 'undefined',
    String = 'string',
    Number = 'number',
    BigInt = 'bigint',
    Symbol = 'symbol',
    Function = 'function',
    NullOrObject = 'object'
}

/**
 * Type guard to check if a value is defined.
 * @param {T} value
 * @returns {boolean} true if value is defined.
 */
export function isDefined<T>(value: T | undefined): value is T {
    return typeof value !== JavaScriptTypeEnum.Undefined;
}

/**
 * Type guard to check if a value is null.
 * @param {any} value
 * @returns {boolean} true if value is null.
 */
export function isNull(value: unknown): value is null {
    return value === null;
}

/**
 * Type guard to check if a value is of string type.
 * @param {T} value
 * @returns {boolean} true if value is of string type.
 */
export function isString(value: unknown): value is string {
    return typeof value === JavaScriptTypeEnum.String;
}

/**
 * Type guard to check if a value is of string type and has at least 1 char.
 * @param {T} value
 * @returns {boolean} true if value is of string type and has at least 1 char.
 */
export function isStringDefined(value: unknown): value is string {
    return isString(value) && value.length > 0;
}

/**
 * Type guard to check if a value is of string type and has at least 1 char.
 * @param {T} value
 * @returns {boolean} true if value is of string type and has at least 1 char.
 */
export function isArrayDefined<T>(value: unknown): value is T[] {
    return Array.isArray(value) && value.length > 0;
}
