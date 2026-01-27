'use client';

import { Game } from '@/types/match';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface TeamOverviewCardsProps {
    recentMatches: Game[];
    upcomingMatches: Game[];
    teamId: number;
}

// Most Recent Result card
function MostRecentResult({ match }: { match: Game | null }) {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';

    if (!match) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm">{lang === 'kz' ? 'Матч жоқ' : 'Нет матчей'}</p>
            </div>
        );
    }

    const dateStr = new Date(match.date).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-full">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-center mb-6">
                {lang === 'kz' ? 'СОҢҒЫ НӘТИЖЕ' : 'ПОСЛЕДНИЙ РЕЗУЛЬТАТ'}
            </h3>

            <div className="flex items-center justify-between flex-1">
                <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                    <img
                        src={match.home_team.logo_url || '/placeholder-team.png'}
                        alt={match.home_team.name}
                        className="w-16 h-16 object-contain"
                    />
                    <span className="text-xs font-bold text-gray-700 leading-tight">
                        {match.home_team.name}
                    </span>
                </div>

                <div className="flex flex-col items-center w-1/3">
                    <span className="text-[11px] text-gray-400 mb-2">{dateStr}</span>
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-900 text-white text-2xl font-black w-10 h-10 rounded-lg flex items-center justify-center">
                            {match.home_score ?? '-'}
                        </span>
                        <span className="bg-gray-900 text-white text-2xl font-black w-10 h-10 rounded-lg flex items-center justify-center">
                            {match.away_score ?? '-'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                    <img
                        src={match.away_team.logo_url || '/placeholder-team.png'}
                        alt={match.away_team.name}
                        className="w-16 h-16 object-contain"
                    />
                    <span className="text-xs font-bold text-gray-700 leading-tight">
                        {match.away_team.name}
                    </span>
                </div>
            </div>

            <div className="mt-4 text-center">
                <Link
                    href={`/matches/${match.id}`}
                    className="inline-block border border-gray-200 rounded-full px-6 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Match Centre
                </Link>
            </div>
        </div>
    );
}

// Team Form card — last 5 results
function TeamForm({ matches, teamId }: { matches: Game[]; teamId: number }) {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const last5 = matches.slice(0, 5);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-full">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-center mb-6">
                {lang === 'kz' ? 'КОМАНДА ФОРМАСЫ' : 'ФОРМА КОМАНДЫ'}
            </h3>

            <div className="flex items-center justify-center gap-3 flex-1">
                {last5.map((game) => {
                    const isHome = game.home_team.id === teamId;
                    const opponent = isHome ? game.away_team : game.home_team;
                    const teamScore = isHome ? game.home_score : game.away_score;
                    const opponentScore = isHome ? game.away_score : game.home_score;

                    return (
                        <div key={game.id} className="flex flex-col items-center gap-2">
                            <img
                                src={opponent.logo_url || '/placeholder-team.png'}
                                alt={opponent.name}
                                className="w-10 h-10 object-contain"
                            />
                            <div className="flex gap-0.5">
                                <span className="bg-gray-900 text-white text-xs font-bold w-6 h-6 rounded flex items-center justify-center">
                                    {teamScore ?? '-'}
                                </span>
                                <span className="bg-gray-900 text-white text-xs font-bold w-6 h-6 rounded flex items-center justify-center">
                                    {opponentScore ?? '-'}
                                </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                                {isHome ? 'H' : 'A'}
                            </span>
                        </div>
                    );
                })}
            </div>

            {last5.length === 0 && (
                <p className="text-gray-400 text-sm text-center flex-1 flex items-center justify-center">
                    {lang === 'kz' ? 'Деректер жоқ' : 'Нет данных'}
                </p>
            )}
        </div>
    );
}

// Fixtures card — upcoming matches
function FixturesList({ matches, teamId }: { matches: Game[]; teamId: number }) {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const upcoming = matches.slice(0, 5);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-full">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-center mb-4">
                {lang === 'kz' ? 'КЕСТЕ' : 'РАСПИСАНИЕ'}
            </h3>

            <div className="flex-1 space-y-3">
                {upcoming.map((game) => {
                    const isHome = game.home_team.id === teamId;
                    const homeAbbr = game.home_team.name.slice(0, 3).toUpperCase();
                    const awayAbbr = game.away_team.name.slice(0, 3).toUpperCase();
                    const dateObj = new Date(game.date);
                    const dateStr = dateObj.toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    });
                    const timeStr = game.time || dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <div key={game.id}>
                            {game.tour && (
                                <div className="text-[10px] font-bold text-gray-900 mb-1">
                                    GW {game.tour} <span className="text-gray-400 font-normal">- {dateStr}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-600">{homeAbbr}</span>
                                    <img src={game.home_team.logo_url || '/placeholder-team.png'} className="w-5 h-5 object-contain" alt="" />
                                </div>
                                <span className="text-xs font-bold text-gray-900">{timeStr}</span>
                                <div className="flex items-center gap-2">
                                    <img src={game.away_team.logo_url || '/placeholder-team.png'} className="w-5 h-5 object-contain" alt="" />
                                    <span className="text-xs font-bold text-gray-600">{awayAbbr}</span>
                                </div>
                                <Link href={`/matches/${game.id}`}>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {upcoming.length === 0 && (
                <p className="text-gray-400 text-sm text-center flex-1 flex items-center justify-center">
                    {lang === 'kz' ? 'Алдағы матчтар жоқ' : 'Нет предстоящих матчей'}
                </p>
            )}

            <div className="mt-4 text-center border-t border-gray-100 pt-3">
                <Link
                    href="/matches"
                    className="inline-flex items-center gap-1 border border-gray-200 rounded-full px-6 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {lang === 'kz' ? 'Барлық кестені көру' : 'Все матчи'} <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}

export function TeamOverviewCards({ recentMatches, upcomingMatches, teamId }: TeamOverviewCardsProps) {
    const lastMatch = recentMatches.length > 0 ? recentMatches[0] : null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MostRecentResult match={lastMatch} />
            <TeamForm matches={recentMatches} teamId={teamId} />
            <FixturesList matches={upcomingMatches} teamId={teamId} />
        </div>
    );
}
