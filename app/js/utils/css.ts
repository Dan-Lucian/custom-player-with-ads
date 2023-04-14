import assembleLiterals from 'utils/assembleLitererals';

export default function css(strings: TemplateStringsArray, ...values: unknown[]): string {
    return assembleLiterals(strings, values);
}
