import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlayerMatchPerformance } from '@/types/player';

interface PlayerMatchesTableProps {
    matches: PlayerMatchPerformance[];
}

export function PlayerMatchesTable({ matches }: PlayerMatchesTableProps) {
    const { t } = useTranslation('player');

    if (!matches || matches.length === 0) return null;

    return (
        <section
            role="region"
            aria-label={t('matches', 'Матчтар')}
            className="w-full bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border border-gray-100 dark:border-dark-border"
        >
            <div className="px-4 md:px-8 py-4 md:py-6 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-black text-primary dark:text-accent-cyan">{t('matches', 'Матчтар')}</h3>
            </div>

            {/* Desktop Table */}
            <div className="relative">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] md:min-w-[800px]">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-gray-100 dark:bg-dark-surface-soft text-slate-700 dark:text-white text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                <th className="px-3 py-3 md:px-6 md:py-4 text-left w-12 md:w-16">{t('round', 'Тур')}</th>
                                <th className="px-3 py-3 md:px-6 md:py-4 text-left">{t('teams', 'Командалар')}</th>
                                <th className="px-3 py-3 md:px-6 md:py-4 text-center w-16 md:w-24">{t('score', 'Есеп')}</th>
                                <th className="px-3 py-3 md:px-6 md:py-4 text-center">{t('matchDate', 'Матч күні')}</th>
                                <th className="px-3 py-3 md:px-6 md:py-4 text-center w-14 md:w-20">{t('min', 'Мин')}</th>
                                <th className="px-2 py-3 md:px-4 md:py-4 text-center w-10 md:w-16 opacity-70">{t('goalsShort', 'Г')}</th>
                                <th className="px-2 py-3 md:px-4 md:py-4 text-center w-10 md:w-16 opacity-70">{t('assistsShort', 'НП')}</th>
                                <th className="px-2 py-3 md:px-4 md:py-4 text-center w-10 md:w-16 opacity-70">{t('yellowShort', 'СҚ')}</th>
                                <th className="px-2 py-3 md:px-4 md:py-4 text-center w-10 md:w-16 opacity-70">{t('redShort', 'ҚҚ')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs md:text-sm font-medium">
                            {matches.map((match: any, index) => {
                                const round = match.round;
                                return (
                                    <tr
                                        key={index}
                                        className="bg-white dark:bg-dark-surface hover:bg-blue-50/50 dark:hover:bg-dark-surface-soft/50 border-b border-gray-100 dark:border-dark-border last:border-0 transition-colors text-gray-700 dark:text-slate-300 group"
                                    >
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-gray-400 dark:text-slate-500 font-bold group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                                            {round}
                                        </td>
                                        <td className="px-3 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center gap-2 md:gap-3 text-slate-800 dark:text-white">
                                                <span className="font-bold text-xs md:text-sm">{match.home}</span>
                                                <span className="text-gray-300 dark:text-slate-600 font-normal">-</span>
                                                <span className="font-bold text-xs md:text-sm">{match.away}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-center font-black text-base md:text-lg text-primary dark:text-accent-cyan">
                                            {match.score}
                                        </td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-center text-gray-500 dark:text-slate-400 font-medium text-[10px] md:text-xs">
                                            {match.date}
                                        </td>
                                        <td className="px-3 py-3 md:px-6 md:py-4 text-center font-bold text-gray-900 dark:text-white">
                                            {match.minutes}&apos;
                                        </td>
                                        <td className="px-2 py-3 md:px-4 md:py-4 text-center text-gray-300 dark:text-slate-600">-</td>
                                        <td className="px-2 py-3 md:px-4 md:py-4 text-center text-gray-300 dark:text-slate-600">-</td>
                                        <td className="px-2 py-3 md:px-4 md:py-4 text-center text-gray-300 dark:text-slate-600">-</td>
                                        <td className="px-2 py-3 md:px-4 md:py-4 text-center text-gray-300 dark:text-slate-600">-</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* Scroll indicator gradient - visible on mobile */}
                <div className="absolute right-0 top-0 bottom-0 w-5 md:w-8 bg-gradient-to-l from-white dark:from-dark-surface to-transparent pointer-events-none md:hidden" />
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2 px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 dark:border-dark-border justify-between bg-gray-50/50 dark:bg-dark-surface/50">
                <div className="flex items-center border border-gray-200 dark:border-dark-border-soft rounded-lg overflow-hidden bg-white dark:bg-dark-surface">
                    <input
                        type="text"
                        placeholder="10"
                        className="w-10 md:w-12 p-2 text-center text-sm outline-none font-bold text-primary dark:text-accent-cyan bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:focus-visible:ring-blue-400"
                        aria-label={t('perPage', 'әр бетте')}
                    />
                    <span className="bg-gray-50 dark:bg-dark-surface px-2 md:px-3 py-2 text-[10px] md:text-xs font-bold text-gray-500 dark:text-slate-400 border-l border-gray-200 dark:border-dark-border-soft uppercase tracking-wide">{t('perPage', 'әр бетте')}</span>
                </div>

                <div className="flex gap-1.5">
                    <button
                        className="min-w-[32px] min-h-[32px] md:w-8 md:h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-dark-border-soft text-gray-400 dark:text-slate-500 hover:bg-white dark:hover:bg-dark-surface-soft hover:border-primary dark:hover:border-accent-cyan hover:text-primary dark:hover:text-accent-cyan transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                        aria-label="Previous page"
                    >
                        ←
                    </button>
                    <button className="min-w-[32px] min-h-[32px] md:w-8 md:h-8 flex items-center justify-center rounded-lg bg-primary dark:bg-cyan-600 text-white font-bold shadow-md shadow-primary/20 dark:shadow-cyan-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2">1</button>
                    <button className="min-w-[32px] min-h-[32px] md:w-8 md:h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-dark-surface-soft text-gray-600 dark:text-slate-400 font-bold transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2">2</button>
                    <button className="min-w-[32px] min-h-[32px] md:w-8 md:h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-dark-surface-soft text-gray-600 dark:text-slate-400 font-bold transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2">3</button>
                    <button className="min-w-[32px] min-h-[32px] md:w-8 md:h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-dark-surface-soft text-gray-600 dark:text-slate-400 font-bold transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2">4</button>
                    <button
                        className="min-w-[32px] min-h-[32px] md:w-8 md:h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-dark-border-soft text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-dark-surface-soft hover:border-primary dark:hover:border-accent-cyan hover:text-primary dark:hover:text-accent-cyan transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                        aria-label="Next page"
                    >
                        →
                    </button>
                </div>
            </div>
        </section>
    );
}
