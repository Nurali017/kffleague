'use client';

import { useEffect, useRef, useState } from 'react';
import { TournamentAwareLink as Link } from '@/components/navigation/TournamentAwareLink';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { navigatePrimary, shouldSkipPrimaryNavigation } from '@/lib/utils/interactiveNavigation';

/* ---------- CircleProgress ---------- */

function CircleProgress({ value, label }: { value: number; label: string }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-[64px] h-[64px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" strokeWidth="3" stroke="rgba(255,255,255,0.2)" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="rgba(255,255,255,0.85)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">
            {Math.round(value)}%
          </span>
        </div>
      </div>
      <span className="text-[9px] text-white/60 text-center leading-tight max-w-[70px]">
        {label}
      </span>
    </div>
  );
}

/* ---------- Types ---------- */

interface RankingEntry {
  rank: number;
  name: string;
  imageUrl?: string | null;
  teamName?: string;
  teamLogoUrl?: string | null;
  value: number | string;
  href?: string | null;
}

interface FeaturedStatBlockProps {
  title: string;
  /** The #1 entity */
  featured: {
    photoUrl?: string | null;
    name: string;
    firstName?: string;
    teamName?: string;
    teamLogoUrl?: string | null;
    mainStat: { label: string; value: number | string };
    secondaryStat?: { label: string; value: number | string };
    circles: Array<{ value: number; label: string }>;
    href?: string | null;
  };
  /** Ranking rows 2–8 */
  rankings: RankingEntry[];
  /** Column headers */
  entityLabel: string;
  valueLabel: string;
  viewFullTableHref: string;
  /** Card accent color */
  accentBg?: string;
}

const TEAM_PLACEHOLDER = '/images/placeholders/team.svg';

/* ---------- Component ---------- */

export function FeaturedStatBlock({
  title,
  featured,
  rankings,
  entityLabel,
  valueLabel,
  viewFullTableHref,
  accentBg = 'bg-emerald-800',
}: FeaturedStatBlockProps) {
  const { t } = useTranslation('statistics');
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    setActiveSlideIndex(0);
    const scroller = mobileSliderRef.current;
    if (!scroller) return;
    scroller.scrollLeft = 0;
  }, [rankings.length]);

  useEffect(() => {
    const scroller = mobileSliderRef.current;
    if (!scroller || rankings.length <= 1) return;

    const maxIndex = Math.max(rankings.length - 1, 0);
    const updateSlideIndex = () => {
      const width = scroller.clientWidth || 1;
      const nextIndex = Math.round(scroller.scrollLeft / width);
      const bounded = Math.max(0, Math.min(nextIndex, maxIndex));
      setActiveSlideIndex(bounded);
    };

    updateSlideIndex();
    scroller.addEventListener('scroll', updateSlideIndex, { passive: true });
    window.addEventListener('resize', updateSlideIndex);
    return () => {
      scroller.removeEventListener('scroll', updateSlideIndex);
      window.removeEventListener('resize', updateSlideIndex);
    };
  }, [rankings.length]);

  const handleDotClick = (index: number) => {
    const scroller = mobileSliderRef.current;
    if (!scroller) return;
    const width = scroller.clientWidth || 1;
    const targetLeft = width * index;
    if (typeof scroller.scrollTo === 'function') {
      scroller.scrollTo({ left: targetLeft, behavior: 'smooth' });
    } else {
      scroller.scrollLeft = targetLeft;
    }
    setActiveSlideIndex(index);
  };

  return (
    <div>
      <h3 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-slate-100 mb-3 uppercase tracking-wide">
        {title}
      </h3>

      <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden shadow-sm flex flex-col lg:flex-row">
        {/* Left: Featured card */}
        {(() => {
          const featuredCard = (
            <div className={`${accentBg} relative w-full lg:w-[340px] xl:w-[380px] shrink-0 min-h-[280px] md:min-h-[320px] flex flex-col`}>
              {/* Player/team photo */}
              {featured.photoUrl && (
                <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden">
                  <img
                    src={featured.photoUrl}
                    alt={featured.name}
                    className="h-full w-full object-contain object-bottom opacity-90"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-current to-transparent opacity-40 pointer-events-none" style={{ color: 'inherit' }} />
                </div>
              )}

              <div className="relative z-10 flex flex-col justify-between h-full p-4 md:p-5">
                <div>
                  <span className="text-white/50 text-xs font-bold">1</span>
                  {featured.firstName && (
                    <div className="text-white/80 text-sm mt-4">{featured.firstName}</div>
                  )}
                  <div className="text-white text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-tight">
                    {featured.name}
                  </div>
                  {featured.teamName && featured.teamLogoUrl && (
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={featured.teamLogoUrl}
                        alt={featured.teamName}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = TEAM_PLACEHOLDER;
                        }}
                      />
                      <span className="text-white/70 text-xs">{featured.teamName}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline gap-4 mb-1">
                    <div>
                      <span className="text-white/60 text-[10px] uppercase tracking-wider block">
                        {featured.mainStat.label}
                      </span>
                      <span className="text-white text-3xl font-black">{featured.mainStat.value}</span>
                    </div>
                    {featured.secondaryStat && (
                      <div>
                        <span className="text-white/60 text-[10px] uppercase tracking-wider block">
                          {featured.secondaryStat.label}
                        </span>
                        <span className="text-white text-3xl font-black">{featured.secondaryStat.value}</span>
                      </div>
                    )}
                  </div>

                  {featured.circles.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {featured.circles.map((c, i) => (
                        <CircleProgress key={i} value={c.value} label={c.label} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

          if (!featured.href) return featuredCard;

          return (
            <Link
              href={featured.href}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-accent-cyan"
              aria-label={featured.name}
            >
              {featuredCard}
            </Link>
          );
        })()}

        {/* Right: Ranking table (desktop) + slider (mobile) */}
        <div className="flex-1 min-w-0">
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface-soft">
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-8">
                    #
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    {entityLabel}
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-16">
                    {valueLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((entry) => {
                  const rowHasHref = Boolean(entry.href);

                  return (
                    <tr
                      key={entry.rank}
                      className={`border-b border-gray-100 dark:border-dark-border last:border-b-0 transition-colors ${
                        rowHasHref ? 'hover:bg-gray-50 dark:hover:bg-dark-surface-soft cursor-pointer' : ''
                      }`}
                      role={rowHasHref ? 'link' : undefined}
                      tabIndex={rowHasHref ? 0 : undefined}
                      onClick={(event) => {
                        if (!rowHasHref) return;
                        if (shouldSkipPrimaryNavigation(event)) return;
                        navigatePrimary(router, entry.href, searchParams);
                      }}
                      onKeyDown={(event) => {
                        if (!rowHasHref) return;
                        if (event.key !== 'Enter' && event.key !== ' ') return;
                        if (shouldSkipPrimaryNavigation(event)) return;
                        event.preventDefault();
                        navigatePrimary(router, entry.href, searchParams);
                      }}
                    >
                      <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-slate-400 font-medium">
                        {entry.rank}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="relative shrink-0">
                            {entry.imageUrl ? (
                              <img
                                src={entry.imageUrl}
                                alt={entry.name}
                                className="w-7 h-7 rounded-full object-cover object-top border border-gray-200 dark:border-dark-border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-dark-border flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-slate-300">
                                {entry.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                              {entry.name}
                            </div>
                            {entry.teamName && (
                              <div className="flex items-center gap-1">
                                {entry.teamLogoUrl && (
                                  <img
                                    src={entry.teamLogoUrl}
                                    alt=""
                                    className="w-3.5 h-3.5 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.src = TEAM_PLACEHOLDER;
                                    }}
                                  />
                                )}
                                <span className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                  {entry.teamName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right text-sm font-bold text-gray-900 dark:text-slate-100">
                        {entry.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden">
            {rankings.length > 0 ? (
              <>
                <div className="px-3 pt-3 text-[11px] text-gray-500 dark:text-slate-400">
                  {t('overview.swipeRankingsHint', { defaultValue: 'Свайпните карточку, чтобы посмотреть все позиции.' })}
                </div>
                <div
                  ref={mobileSliderRef}
                  data-testid="featured-mobile-rankings-slider"
                  className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 px-3 py-3"
                >
                  {rankings.map((entry, index) => {
                    const card = (
                      <div
                        data-testid="featured-mobile-ranking-slide"
                        className="w-full shrink-0 snap-start rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50/70 dark:bg-dark-surface-soft p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative shrink-0">
                              {entry.imageUrl ? (
                                <img
                                  src={entry.imageUrl}
                                  alt={entry.name}
                                  className="w-11 h-11 rounded-full object-cover object-top border border-gray-200 dark:border-dark-border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-dark-border flex items-center justify-center text-sm font-bold text-gray-500 dark:text-slate-300">
                                  {entry.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-base font-bold text-gray-900 dark:text-slate-100 truncate">
                                {entry.name}
                              </div>
                              {entry.teamName && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {entry.teamLogoUrl && (
                                    <img
                                      src={entry.teamLogoUrl}
                                      alt=""
                                      className="w-4 h-4 object-contain shrink-0"
                                      onError={(e) => {
                                        e.currentTarget.src = TEAM_PLACEHOLDER;
                                      }}
                                    />
                                  )}
                                  <span className="text-xs text-gray-500 dark:text-slate-400 truncate">
                                    {entry.teamName}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="text-2xl font-black text-gray-900 dark:text-slate-100 shrink-0">
                            {entry.value}
                          </span>
                        </div>
                      </div>
                    );

                    if (!entry.href) return <div key={`${entry.rank}-${index}`} className="w-full shrink-0 snap-start">{card}</div>;

                    return (
                      <Link key={`${entry.rank}-${index}`} href={entry.href} className="w-full shrink-0 snap-start block">
                        {card}
                      </Link>
                    );
                  })}
                </div>
                {rankings.length > 1 && (
                  <div data-testid="featured-mobile-ranking-dots" className="flex items-center justify-center gap-1.5 px-3 pb-3">
                    {rankings.map((entry, index) => (
                      <button
                        key={`${entry.rank}-${index}`}
                        type="button"
                        data-testid={`featured-mobile-ranking-dot-${index}`}
                        aria-label={`Go to ranking slide ${index + 1}`}
                        onClick={() => handleDotClick(index)}
                        className={`h-2 rounded-full transition-all ${
                          activeSlideIndex === index
                            ? 'w-5 bg-primary dark:bg-accent-cyan'
                            : 'w-2 bg-gray-300 dark:bg-dark-border-soft'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 dark:text-slate-400">
                {t('overview.noRankingData', { defaultValue: 'Рейтинг пока недоступен.' })}
              </div>
            )}
          </div>

          <div className="px-3 py-3 border-t border-gray-200 dark:border-dark-border">
            <Link
              href={viewFullTableHref}
              className="text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent-cyan transition-colors flex items-center gap-1 uppercase tracking-wider"
            >
              {t('fullList', { defaultValue: 'Полный список' })}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
