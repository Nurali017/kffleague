'use client';

import { Game } from '@/types/match';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TeamLeagueTable } from './TeamLeagueTable';
import { TeamCoachingStaff } from './TeamCoachingStaff';

interface TeamOverviewSectionProps {
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
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center">
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
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
            <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider text-center mb-4">
                MOST RECENT RESULT
            </h3>

            <div className="flex items-center justify-between flex-1 gap-2">
                <div className="flex flex-col items-center gap-1.5 w-1/3 text-center">
                    <img
                        src={match.home_team.logo_url || '/placeholder-team.png'}
                        alt={match.home_team.name}
                        className="w-12 h-12 object-contain"
                    />
                    <span className="text-[10px] font-bold text-gray-600 leading-tight uppercase">
                        {match.home_team.name}
                    </span>
                </div>

                <div className="flex flex-col items-center w-1/3">
                    <span className="text-[10px] text-gray-400 mb-1.5">{dateStr}</span>
                    <div className="flex items-center gap-1">
                        <span className="bg-primary text-white text-lg font-black w-8 h-8 rounded-md flex items-center justify-center">
                            {match.home_score ?? '-'}
                        </span>
                        <span className="bg-primary text-white text-lg font-black w-8 h-8 rounded-md flex items-center justify-center">
                            {match.away_score ?? '-'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1.5 w-1/3 text-center">
                    <img
                        src={match.away_team.logo_url || '/placeholder-team.png'}
                        alt={match.away_team.name}
                        className="w-12 h-12 object-contain"
                    />
                    <span className="text-[10px] font-bold text-gray-600 leading-tight uppercase">
                        {match.away_team.name}
                    </span>
                </div>
            </div>

            <div className="mt-3 text-center">
                <Link
                    href={`/matches/${match.id}`}
                    className="inline-block border border-gray-200 rounded-full px-5 py-1.5 text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Match Centre
                </Link>
            </div>
        </div>
    );
}

// Team Form card — last 5 results
function TeamForm({ matches, teamId }: { matches: Game[]; teamId: number }) {
    const last5 = matches.slice(0, 5);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
            <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider text-center mb-4">
                TEAM FORM
            </h3>

            <div className="flex items-center justify-center gap-3 flex-1">
                {last5.map((game) => {
                    const isHome = game.home_team.id === teamId;
                    const opponent = isHome ? game.away_team : game.home_team;
                    const teamScore = isHome ? game.home_score : game.away_score;
                    const opponentScore = isHome ? game.away_score : game.home_score;

                    return (
                        <div key={game.id} className="flex flex-col items-center gap-1.5">
                            <img
                                src={opponent.logo_url || '/placeholder-team.png'}
                                alt={opponent.name}
                                className="w-9 h-9 object-contain"
                            />
                            <div className="flex gap-px">
                                <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-sm flex items-center justify-center">
                                    {teamScore ?? '-'}
                                </span>
                                <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-sm flex items-center justify-center">
                                    {opponentScore ?? '-'}
                                </span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium">
                                {isHome ? 'H' : 'A'}
                            </span>
                        </div>
                    );
                })}
            </div>

            {last5.length === 0 && (
                <p className="text-gray-400 text-xs text-center flex-1 flex items-center justify-center">
                    No data
                </p>
            )}
        </div>
    );
}

// Fixtures card — upcoming matches (right column, full height)
function FixturesList({ matches, teamId }: { matches: Game[]; teamId: number }) {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const upcoming = matches.slice(0, 5);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col h-full">
            <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider text-center mb-4">
                FIXTURES
            </h3>

            <div className="flex-1 space-y-4">
                {upcoming.map((game) => {
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
                                <div className="text-[10px] mb-1">
                                    <span className="font-bold text-gray-900">GW {game.tour}</span>
                                    <span className="text-gray-400"> - {dateStr}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-600 w-8 text-right">{homeAbbr}</span>
                                <img src={game.home_team.logo_url || '/placeholder-team.png'} className="w-5 h-5 object-contain" alt="" />
                                <span className="text-xs font-bold text-gray-900 flex-1 text-center">{timeStr}</span>
                                <img src={game.away_team.logo_url || '/placeholder-team.png'} className="w-5 h-5 object-contain" alt="" />
                                <span className="text-xs font-bold text-gray-600 w-8">{awayAbbr}</span>
                                <Link href={`/matches/${game.id}`}>
                                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {upcoming.length === 0 && (
                <p className="text-gray-400 text-xs text-center flex-1 flex items-center justify-center">
                    {lang === 'kz' ? 'Алдағы матчтар жоқ' : 'Нет предстоящих матчей'}
                </p>
            )}

            <div className="mt-4 text-center border-t border-gray-100 pt-3">
                <Link
                    href="/matches"
                    className="inline-flex items-center gap-1 border border-gray-200 rounded-full px-5 py-1.5 text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    View All Fixtures <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}

export function TeamOverviewSection({ recentMatches, upcomingMatches, teamId }: TeamOverviewSectionProps) {
    const lastMatch = recentMatches.length > 0 ? recentMatches[0] : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            {/* Left column */}
            <div className="space-y-6">
                {/* Top row: Recent Result + Team Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MostRecentResult match={lastMatch} />
                    <TeamForm matches={recentMatches} teamId={teamId} />
                </div>

                {/* League Table */}
                <TeamLeagueTable teamId={teamId} />

                {/* Coaching Staff */}
                <TeamCoachingStaff teamId={teamId} />
            </div>

            {/* Right column: Fixtures (full height) */}
            <FixturesList matches={upcomingMatches} teamId={teamId} />
        </div>
    );
}
