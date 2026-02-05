import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HomeMatches } from '@/components/HomeMatches';
import { HeroSection } from '@/components/HeroSection';
import { SeasonStats } from '@/components/SeasonStats';
import { PlayerLeaderboard } from '@/components/PlayerLeaderboard';
import { LeagueTable } from '@/components/LeagueTable';
import { NewsFeatured, NewsSideCards } from '@/components/NewsSection';
import { VideoGrid } from '@/components/VideoGrid';

export default function HomePage() {
  // KFF League videos from kffleague.kz - показываем 4 видео в одну строку
  const mediaVideos = [
    { id: 1, title: 'Премьер-лиганың 26-турының үздік голдары', youtubeId: '-LxnCdR-pxI' },
    { id: 2, title: 'Премьер-лиганың 22-турының үздік голдары', youtubeId: 'HcY3luVxyzo' },
    { id: 3, title: 'Премьер-лиганың 21-турының үздік голдары', youtubeId: 'K_6ov7ERSuE' },
    { id: 4, title: 'Премьер-лиганың 20-турының үздік голдары', youtubeId: 'hSb0s6kj_JA' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10 space-y-8 dark:bg-dark-bg">
      {/* Row 1: Hero + HomeMatches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-9 h-[500px]">
          <HeroSection />
        </div>
        <div className="lg:col-span-3 h-[500px]">
          <HomeMatches />
        </div>
      </div>

      {/* Row 2: News + LeagueTable (aligned with MatchCenter) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* News section */}
        <section className="lg:col-span-9 bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1E4D8C] dark:text-accent-cyan tracking-tight">Жаңалықтар</h2>
            <Link
              href="/news"
              className="text-gray-500 dark:text-slate-400 font-medium text-sm hover:text-[#1E4D8C] dark:hover:text-accent-cyan flex items-center transition-colors group"
            >
              Барлық жаңалықтар
              <ChevronRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 items-stretch">
            <div className="md:col-span-2 min-h-[350px]">
              <NewsFeatured />
            </div>
            <div className="h-full">
              <NewsSideCards />
            </div>
          </div>
        </section>

        {/* LeagueTable - same height as news */}
        <div className="lg:col-span-3 h-full">
          <LeagueTable />
        </div>
      </div>

      <section>
        <PlayerLeaderboard />
      </section>

      <section>
        <SeasonStats />
      </section>

      <section>
        <VideoGrid title="Медиа" videos={mediaVideos} />
      </section>
    </div>
  );
}
