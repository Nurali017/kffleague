import React from 'react';
import { Paintbrush } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils/cn';
import {
  PlayerPageVariant,
  PLAYER_PAGE_VARIANT_OPTIONS,
} from './playerPageVariants';

interface PlayerPageVariantSwitcherProps {
  value: PlayerPageVariant;
  onChange: (variant: PlayerPageVariant) => void;
}

export function PlayerPageVariantSwitcher({ value, onChange }: PlayerPageVariantSwitcherProps) {
  const { t } = useTranslation('player');
  const activeVariant = PLAYER_PAGE_VARIANT_OPTIONS.find((option) => option.value === value);

  return (
    <section
      aria-label={t('uiVariant.ariaLabel', { defaultValue: 'Page style options' })}
      className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur dark:border-dark-border dark:bg-dark-surface/80 md:px-6 md:py-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <Paintbrush className="h-4 w-4 text-primary dark:text-accent-cyan" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 md:text-base">
          {t('uiVariant.title', { defaultValue: 'Вариант UI страницы игрока' })}
        </h2>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible">
        {PLAYER_PAGE_VARIANT_OPTIONS.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'min-h-[44px] min-w-[150px] rounded-xl border px-3 py-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-dark-surface',
                isActive
                  ? 'border-primary bg-primary text-white shadow-md shadow-primary/20 dark:border-accent-cyan dark:bg-cyan-600 dark:shadow-cyan-500/20'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/40 hover:bg-white dark:border-dark-border dark:bg-dark-surface dark:text-slate-300 dark:hover:border-accent-cyan/40 dark:hover:bg-dark-surface-soft'
              )}
              aria-pressed={isActive}
            >
              <span className="block text-sm font-bold">
                {t(option.labelKey, { defaultValue: option.fallbackLabel })}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
        {activeVariant
          ? t(activeVariant.descriptionKey, {
            defaultValue: activeVariant.fallbackDescription,
          })
          : null}
      </p>
    </section>
  );
}
