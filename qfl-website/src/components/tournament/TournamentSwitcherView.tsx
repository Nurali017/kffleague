'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, X } from 'lucide-react';
import { Tournament } from '@/types/tournament';
import { bottomSheetSlideUp, modalBackdrop } from '@/lib/motion';

interface TournamentSwitcherViewProps {
  tournaments: Tournament[];
  currentId: string;
  lang: 'ru' | 'kz';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (tournamentId: string) => void;
}

function getTournamentLabel(t: Tournament, lang: 'ru' | 'kz') {
  return t.name?.[lang] || t.name?.ru || t.name?.short || 'Tournament';
}

export function TournamentSwitcherView({
  tournaments,
  currentId,
  lang,
  open,
  onOpenChange,
  onSelect,
}: TournamentSwitcherViewProps) {
  const currentTournament = tournaments.find((t) => t.id === currentId) || tournaments[0];

  // Close on escape + lock body scroll while open
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onOpenChange]);

  if (!currentTournament) return null;

  const triggerLabel = getTournamentLabel(currentTournament, lang);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="
          flex items-center gap-2 max-w-[170px]
          rounded-xl border border-slate-200 bg-white px-2.5 py-1.5
          text-xs font-bold text-[#1E4D8C]
          hover:bg-slate-50 transition-colors
          dark:border-dark-border-soft dark:bg-dark-surface-soft dark:text-accent-cyan dark:hover:bg-dark-border-soft
        "
        aria-label="Выбрать турнир"
      >
        <img
          src={currentTournament.logo}
          alt={triggerLabel}
          className="w-5 h-5 object-contain filter brightness-0 sepia saturate-[10] hue-rotate-[190deg] dark:invert dark:sepia-0 dark:saturate-100 dark:hue-rotate-0"
          onError={(e) => {
            // Keep the trigger compact even if logo is missing
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="truncate">{currentTournament.name?.short || triggerLabel}</span>
        <ChevronDown className="w-4 h-4 opacity-70 shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[60] lg:hidden"
              variants={modalBackdrop}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => onOpenChange(false)}
              aria-hidden="true"
              data-testid="tournament-switcher-backdrop"
            />

            <motion.div
              className="
                fixed inset-x-0 bottom-0 z-[70] lg:hidden
                rounded-t-2xl border border-white/10 bg-white shadow-2xl
                dark:bg-dark-surface dark:border-dark-border
                max-h-[80vh] overflow-hidden
              "
              variants={bottomSheetSlideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Выбор турнира"
            >
              <div className="px-4 pt-3 pb-2 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-[#1E4D8C] dark:text-white truncate">
                    Выбор турнира
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Сейчас: {currentTournament.name?.short || triggerLabel}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-surface-soft transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                </button>
              </div>

              <div className="overflow-y-auto px-2 py-2">
                {tournaments.map((t) => {
                  const active = t.id === currentId;
                  const label = getTournamentLabel(t, lang);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors
                        ${active
                          ? 'bg-[#1E4D8C]/10 text-[#1E4D8C] dark:bg-white/10 dark:text-white'
                          : 'hover:bg-slate-100 text-slate-800 dark:text-slate-100 dark:hover:bg-white/5'}
                      `}
                      onClick={() => {
                        onSelect(t.id);
                        onOpenChange(false);
                      }}
                      aria-label={`Выбрать ${label}`}
                    >
                      <img
                        src={t.logo}
                        alt={label}
                        className="w-8 h-8 object-contain filter brightness-0 sepia saturate-[10] hue-rotate-[190deg] dark:invert dark:sepia-0 dark:saturate-100 dark:hue-rotate-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="text-sm font-bold truncate">{label}</div>
                        {t.name?.short && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {t.name.short}
                          </div>
                        )}
                      </div>
                      {active && (
                        <span className="text-[11px] font-extrabold px-2 py-1 rounded-full bg-[#E5B73B]/20 text-[#8a6a00] dark:bg-[#E5B73B]/15 dark:text-[#E5B73B]">
                          ACTIVE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

