'use client';

import { useTranslation } from 'react-i18next';
import { Globe, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useTournament } from '@/contexts/TournamentContext';
import { TeamDetail } from '@/types/team';

interface TeamPageHeroProps {
    team: TeamDetail;
}

export function TeamPageHero({ team }: TeamPageHeroProps) {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const { currentTournament } = useTournament();

    const tournamentName =
        (currentTournament.name as Record<string, string>)[lang] || currentTournament.name.short;

    return (
        <div className="relative w-full bg-gradient-to-r from-primary to-primary/80 pt-24 pb-12 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-1/2" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Logo */}
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-4 flex items-center justify-center shadow-lg border-4 border-white shrink-0">
                    {team.logo_url && (
                        <img src={team.logo_url} alt={team.name} className="w-full h-full object-contain" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left text-white pt-2">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2 block">
                        {tournamentName}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-1">
                        {team.name}
                    </h1>
                    {team.city && (
                        <p className="text-xl opacity-90 font-medium mb-4">
                            {team.city}
                        </p>
                    )}

                    {/* Stadium + Website */}
                    <div className="flex items-center justify-center md:justify-start gap-8 mb-2">
                        {team.stadium && (
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase opacity-60 font-bold">
                                    {lang === 'kz' ? 'Стадион' : 'Стадион'}
                                </span>
                                <span className="font-bold flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {team.stadium.name}
                                </span>
                            </div>
                        )}
                        {team.website && (
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase opacity-60 font-bold">
                                    {lang === 'kz' ? 'Клуб сайты' : 'Сайт клуба'}
                                </span>
                                <Link
                                    href={team.website.startsWith('http') ? team.website : `https://${team.website}`}
                                    target="_blank"
                                    className="font-bold hover:underline flex items-center gap-1"
                                >
                                    {team.website.replace(/^https?:\/\//, '')} <Globe className="w-3 h-3" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
