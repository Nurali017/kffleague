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
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-100 rounded w-48" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-32 bg-gray-50 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!coaches.length) return null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-black text-gray-900 uppercase mb-6">
                {lang === 'kz' ? 'Жаттықтырушылар штабы' : 'Тренерский штаб'}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coaches.map((coach) => (
                    <div
                        key={coach.id}
                        className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        {coach.photo_url ? (
                            <img
                                src={coach.photo_url}
                                alt={`${coach.first_name} ${coach.last_name}`}
                                className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-white shadow"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3 border-2 border-white shadow">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                        <span className="font-bold text-sm text-gray-900">
                            {coach.first_name} {coach.last_name}
                        </span>
                        <span className="text-[10px] font-bold text-primary uppercase mt-1">
                            {ROLE_LABELS[coach.role]?.[lang] || coach.role}
                        </span>
                        {coach.country && (
                            <span className="text-[10px] text-gray-400 mt-0.5">
                                {coach.country.name}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
