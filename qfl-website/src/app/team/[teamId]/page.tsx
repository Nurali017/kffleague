'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notFound } from 'next/navigation';
import {
    TeamPageHero,
    TeamPageTabs,
    TeamSquad,
    TeamMatches,
    TeamOverviewSection,
    TeamPlayerStats,
    TeamKeyStats,
    TeamCoachingStaff,
    TeamFullStats,
} from '@/components/team';
import {
    useTeamDetail,
    useTeamGames,
    useTeamPlayers,
    useTeamStats,
} from '@/hooks/useTeam';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { fadeInUp, staggerContainer } from '@/lib/motion/variants';
import { motion } from 'motion/react';

interface TeamPageProps {
    params: {
        teamId: string;
    };
}

// Coming Soon placeholder for unimplemented tabs
function ComingSoon({ title }: { title: string }) {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-gray-300 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
            <p className="text-gray-400">
                {lang === 'kz' ? 'Жақында қосылады' : 'Скоро будет доступно'}
            </p>
        </div>
    );
}

export default function TeamPage({ params }: TeamPageProps) {
    const { t, i18n } = useTranslation();
    const teamId = Number(params.teamId);
    const [activeTab, setActiveTab] = useState('overview');
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';

    const { team, loading: teamLoading, error: teamError } = useTeamDetail(teamId);
    const { games, recentMatches, upcomingMatches, loading: gamesLoading } = useTeamGames(teamId);
    const { players, loading: playersLoading } = useTeamPlayers(teamId);
    const { stats } = useTeamStats(teamId);

    const isLoading = teamLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!team || teamError) {
        if (teamError?.status === 404) notFound();
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <ErrorMessage
                    message={t('team.load_error', 'Failed to load team data')}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F9FA] pb-24 font-sans">
            <TeamPageHero team={team} />

            <TeamPageTabs activeTab={activeTab} onChange={setActiveTab} />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-12">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-12"
                    >
                        <motion.div variants={fadeInUp}>
                            <TeamOverviewSection
                                recentMatches={recentMatches}
                                upcomingMatches={upcomingMatches}
                                teamId={teamId}
                            />
                        </motion.div>

                        {stats && stats.games_played > 0 && (
                            <motion.div variants={fadeInUp}>
                                <TeamKeyStats stats={stats} />
                            </motion.div>
                        )}

                        <motion.div variants={fadeInUp}>
                            <TeamPlayerStats teamId={teamId} />
                        </motion.div>
                    </motion.div>
                )}

                {/* Matches Tab */}
                {activeTab === 'matches' && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <TeamMatches
                            games={games}
                            teamId={teamId}
                            loading={gamesLoading}
                        />
                    </motion.div>
                )}

                {/* Squad Tab */}
                {activeTab === 'squad' && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <TeamSquad
                            players={players}
                            loading={playersLoading}
                        />
                    </motion.div>
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <TeamFullStats teamId={teamId} />
                    </motion.div>
                )}

                {/* Staff Tab */}
                {activeTab === 'staff' && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <TeamCoachingStaff teamId={teamId} />
                    </motion.div>
                )}

            </div>
        </main>
    );
}
