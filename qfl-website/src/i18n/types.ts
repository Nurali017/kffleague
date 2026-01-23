export const SUPPORTED_LANGUAGES = ['kz', 'ru'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  ru: 'Русский',
  kz: 'Қазақша',
};
