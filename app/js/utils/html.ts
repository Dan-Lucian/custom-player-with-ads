import assembleLiterals from './assembleLitererals';

export default function html(strings: TemplateStringsArray, ...values: unknown[]): string {
    return assembleLiterals(strings, values);
}
