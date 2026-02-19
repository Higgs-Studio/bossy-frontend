export type TemplateVars = Record<string, string | number | boolean | null | undefined>;

function toStringValue(value: TemplateVars[string]): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

/**
 * Replace `{var}` placeholders in a template string.
 *
 * - Unknown placeholders are left as-is.
 * - `null`/`undefined` become empty string.
 */
export function formatTemplate(template: string, vars: TemplateVars = {}): string {
  return template.replace(/\{([^{}]+)\}/g, (match, key) => {
    const value = vars[key];
    if (value === undefined) return match;
    return toStringValue(value);
  });
}

export type PluralRule = Intl.LDMLPluralRule;

/**
 * Pick a plural form using `Intl.PluralRules`.
 *
 * Provide at least `other`. For languages like Chinese, the rule is typically `other`.
 */
export function selectPlural(
  locale: string,
  count: number,
  forms: Partial<Record<PluralRule, string>> & { other: string },
): string {
  const rule = new Intl.PluralRules(locale).select(count);
  return forms[rule] ?? forms.other;
}

export function formatPluralTemplate(
  locale: string,
  count: number,
  forms: Partial<Record<PluralRule, string>> & { other: string },
  vars: TemplateVars = {},
): string {
  const template = selectPlural(locale, count, forms);
  return formatTemplate(template, { ...vars, count });
}

