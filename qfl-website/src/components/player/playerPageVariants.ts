export const PLAYER_PAGE_VARIANTS = ['clarity', 'studio', 'data'] as const;

export type PlayerPageVariant = (typeof PLAYER_PAGE_VARIANTS)[number];

export interface PlayerPageVariantOption {
  value: PlayerPageVariant;
  labelKey: string;
  fallbackLabel: string;
  descriptionKey: string;
  fallbackDescription: string;
}

export const PLAYER_PAGE_VARIANT_OPTIONS: PlayerPageVariantOption[] = [
  {
    value: 'clarity',
    labelKey: 'uiVariant.options.clarity.label',
    fallbackLabel: 'Clarity',
    descriptionKey: 'uiVariant.options.clarity.description',
    fallbackDescription: 'Clean and balanced layout with soft accents.',
  },
  {
    value: 'studio',
    labelKey: 'uiVariant.options.studio.label',
    fallbackLabel: 'Studio',
    descriptionKey: 'uiVariant.options.studio.description',
    fallbackDescription: 'Visual-first hero with stronger contrast.',
  },
  {
    value: 'data',
    labelKey: 'uiVariant.options.data.label',
    fallbackLabel: 'Data',
    descriptionKey: 'uiVariant.options.data.description',
    fallbackDescription: 'Compact and analytical, focused on numbers.',
  },
];

export const DEFAULT_PLAYER_PAGE_VARIANT: PlayerPageVariant = 'clarity';

export function isPlayerPageVariant(value: string | null): value is PlayerPageVariant {
  return Boolean(value && PLAYER_PAGE_VARIANTS.includes(value as PlayerPageVariant));
}
