'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notFound } from 'next/navigation';
import {
    TeamPageHero,
    TeamPageTabs,
    TeamDashboard,
    TeamKits,
    TeamNews,
} from '@/components/team';
import {
    useTeamDetail,
    useTeamGames
} from '@/hooks/useTeam';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { fadeInUp, staggerContainer } from '@/lib/motion/variants';
import { motion } from 'motion/react';

interface TeamPageProps {
    params: {
        teamId: string;
        locale: string;
    };
}

export default function TeamPage({ params }: TeamPageProps) {
    const { t } = useTranslation();
    const teamId = Number(params.teamId);
    const [activeTab, setActiveTab] = useState('overview');

    const { team, loading: teamLoading, error: teamError } = useTeamDetail(teamId);
    const { recentMatches, upcomingMatches, loading: gamesLoading } = useTeamGames(teamId);

    const isLoading = teamLoading || gamesLoading;

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

    const dashboardMatches = [...recentMatches.slice(0, 1), ...upcomingMatches.slice(0, 1)];

    return (
        <main className="min-h-screen bg-[#F8F9FA] pb-24 font-sans">
            <TeamPageHero team={team} />

            <TeamPageTabs activeTab={activeTab} onChange={setActiveTab} />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-12">

                {activeTab === 'overview' && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-16"
                    >
                        <motion.div variants={fadeInUp}>
                            <TeamDashboard matches={dashboardMatches} />
                        </motion.div>

                        <motion.div variants={fadeInUp} className="max-w-4xl">
                            <h2 className="text-2xl font-black text-gray-900 mb-4">Команда туралы</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {(team as any).description}
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <TeamKits kits={(team as any).kits} />
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <TeamNews />
                        </motion.div>

                    </motion.div>
                )}
            </div>
        </main>
    );
}
