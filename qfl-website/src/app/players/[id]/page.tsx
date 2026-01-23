'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePlayerDetail, usePlayerMatches } from '@/hooks';
import { PlayerProfile } from '@/components/PlayerProfile';
import { PlayerSeasonStats } from '@/components/PlayerSeasonStats';
import { PlayerMatchHistory } from '@/components/PlayerMatchHistory';

function PlayerDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-80 bg-gray-200 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function PlayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation('player');

  const playerId = params.id as string;
  const { player, loading, error } = usePlayerDetail(playerId);
  const { matches, loading: matchesLoading } = usePlayerMatches(playerId, 10);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <PlayerDetailSkeleton />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {t('notFound')}
          </h1>
          <p className="text-gray-500 mb-8">{t('notFoundMessage')}</p>
          <button
            onClick={() => router.push('/table')}
            className="inline-flex items-center px-6 py-3 bg-[#1E4D8C] text-white rounded-lg hover:bg-[#163a6b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToPlayers')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm mb-6">
        <Link href="/" className="text-gray-500 hover:text-[#1E4D8C] transition-colors">
          Главная
        </Link>
        <span className="text-gray-300">/</span>
        <Link href="/table" className="text-gray-500 hover:text-[#1E4D8C] transition-colors">
          Таблица
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-[#1E4D8C] font-medium">
          {player.first_name} {player.last_name}
        </span>
      </nav>

      {/* Player Profile */}
      <PlayerProfile player={player} />

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats & Match History */}
        <div className="lg:col-span-2 space-y-6">
          <PlayerSeasonStats stats={player.season_stats} />
          <PlayerMatchHistory matches={matches} loading={matchesLoading} />
        </div>

        {/* Sidebar - можно добавить дополнительную информацию */}
        <div className="lg:col-span-1 space-y-6">
          {/* Место для будущих компонентов, например:
          - Достижения игрока
          - Похожие игроки
          - Новости об игроке
          */}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-[#1E4D8C] hover:text-[#E5B73B] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </button>
      </div>
    </div>
  );
}
