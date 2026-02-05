'use client';

import { useTranslation } from 'react-i18next';
import { useTeamCoaches } from '@/hooks/useTeam';
import { useTournament } from '@/contexts/TournamentContext';
import { User } from 'lucide-react';

interface TeamCoachingStaffProps {
    teamId: number;
}

const ROLE_LABELS: Record<string, Record<string, string>> = {
    head_coach: { kz: 'Бас бапкер', ru: 'Главный тренер' },
    assistant: { kz: 'Көмекші бапкер', ru: 'Помощник тренера' },
    goalkeeper_coach: { kz: 'Қақпашылар бапкері', ru: 'Тренер вратарей' },
    fitness_coach: { kz: 'Дене дайындық бапкері', ru: 'Тренер по физподготовке' },
    other: { kz: 'Басқа', ru: 'Другое' },
};

export function TeamCoachingStaff({ teamId }: TeamCoachingStaffProps) {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const { currentSeason } = useTournament();
    const { coaches, loading } = useTeamCoaches(teamId, currentSeason.id);

    if (loading) {
        return (
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-[0_20px_40px_rgba(3,10,25,0.5)] p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-48" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-32 bg-gray-100 dark:bg-white/5 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!coaches.length) return null;

    return (
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-[0_20px_40px_rgba(3,10,25,0.5)] p-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-5">
                {lang === 'kz' ? 'Жаттықтырушылар штабы' : 'Тренерский штаб'}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coaches.map((coach) => (
                    <div
                        key={coach.id}
                        className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/25 transition-colors"
                    >
                        {coach.photo_url ? (
                            <img
                                src={coach.photo_url}
                                alt={`${coach.first_name} ${coach.last_name}`}
                                className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-gray-300 dark:border-white/20 shadow"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-3 border-2 border-gray-300 dark:border-white/20 shadow">
                                <User className="w-8 h-8 text-slate-400 dark:text-white/40" />
                            </div>
                        )}
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {coach.first_name} {coach.last_name}
                        </span>
                        <span className="text-[10px] font-bold text-[#1E4D8C] dark:text-cyan-300 uppercase mt-1">
                            {ROLE_LABELS[coach.role]?.[lang] || coach.role}
                        </span>
                        {coach.country && (
                            <span className="text-[10px] text-slate-400 dark:text-white/50 mt-0.5">
                                {coach.country.name}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
