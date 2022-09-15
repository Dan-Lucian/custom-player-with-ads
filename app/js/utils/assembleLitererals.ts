export default function assembleLiterals(strings: TemplateStringsArray, values: unknown[]): string {
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
