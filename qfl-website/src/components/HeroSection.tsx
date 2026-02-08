'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useLatestNews, useSliderNews } from '@/hooks';
import { HeroSkeleton } from '@/components/ui/Skeleton';
import { formatNewsDate } from '@/lib/utils/dateFormat';
import { useTournament } from '@/contexts/TournamentContext';

const SLIDE_DURATION = 6000;

// Change this to switch between variants: 'compact' | 'card' | 'minimal' | 'split'
const HERO_VARIANT: 'compact' | 'card' | 'minimal' | 'split' = 'compact';

export function HeroSection() {
  const { t, i18n } = useTranslation();
  const { t: tNews } = useTranslation('news');
  const { currentTournament } = useTournament();
  const { sliderNews, loading: sliderLoading, error: sliderError } = useSliderNews({
    limit: 5,
    tournamentId: currentTournament.id,
  });
  const { latestNews, loading: latestLoading, error: latestError } = useLatestNews({
    limit: 5,
    tournamentId: currentTournament.id,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const useFallback = !sliderLoading && sliderNews.length === 0;
  const heroNews = useFallback ? latestNews : sliderNews;
  const loading = sliderLoading || (useFallback && latestLoading);
  const error = useFallback ? latestError : sliderError;

  useEffect(() => {
    setCurrentIndex(0);
  }, [i18n.language, currentTournament.id, useFallback, heroNews.length]);

  const goToNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % heroNews.length);
  }, [heroNews.length]);

  const goToPrevious = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev === 0 ? heroNews.length - 1 : prev - 1));
  }, [heroNews.length]);

  useEffect(() => {
    if (heroNews.length === 0 || isPaused) return;

    const timer = setTimeout(goToNext, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [heroNews.length, isPaused, goToNext, currentIndex]);

  if (loading) {
    return <HeroSkeleton />;
  }

  if (error || heroNews.length === 0) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-primary-dark dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
        <p className="text-white/70">{t('noData.noNews')}</p>
      </div>
    );
  }

  const currentNews = heroNews[currentIndex];
  const newsBadgeLabel =
    currentNews.article_type === 'ANALYTICS'
      ? tNews('typeAnalytics')
      : currentNews.article_type === 'NEWS'
        ? tNews('typeNews')
        : t('news');

  // Navigation component (reused across variants)
  const Navigation = () =>
    heroNews.length > 1 && (
      <>
        <button
          onClick={goToPrevious}
          aria-label="Предыдущий слайд"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={goToNext}
          aria-label="Следующий слайд"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </>
    );

  // Progress indicators (CSS animation, no React state re-renders)
  const ProgressIndicators = ({ className = '' }: { className?: string }) =>
    heroNews.length > 1 && (
      <div className={`flex items-center space-x-1.5 ${className}`}>
        {heroNews.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection('next');
              setCurrentIndex(index);
            }}
            aria-label={`Перейти к слайду ${index + 1}`}
            className={`relative h-1 rounded-full overflow-hidden transition-all duration-300 hover:bg-white/50 ${
              index === currentIndex ? 'w-8 bg-white/30' : 'w-4 bg-white/30'
            }`}
          >
            {index === currentIndex && (
              <div
                key={currentIndex}
                className="absolute inset-y-0 left-0 bg-accent rounded-full animate-hero-progress"
                style={{
                  animationDuration: `${SLIDE_DURATION}ms`,
                  animationPlayState: isPaused ? 'paused' : 'running',
                }}
              />
            )}
          </button>
        ))}
      </div>
    );

  // Background images: all rendered at once, opacity crossfade
  const BackgroundImages = () => (
    <>
      {heroNews.map((news, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === currentIndex ? 1 : 0 }}
        >
          <img
            src={news.image_url || '/images/news-placeholder.svg'}
            alt={news.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}
    </>
  );

  // ============================================
  // VARIANT 1: COMPACT - минимум элементов внизу
  // ============================================
  if (HERO_VARIANT === 'compact') {
    return (
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden group bg-gradient-to-br from-primary to-primary-dark dark:from-slate-800 dark:to-slate-950"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <BackgroundImages />

        {/* Мягкий градиент внизу */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

        {/* Компактный контент (без backdrop-blur чтобы не выглядело как "loading") */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Link href={`/news/${currentNews.id}`} className="block max-w-2xl group/title">
            <span className="inline-block bg-accent text-white text-xs font-bold px-2 py-1 rounded mb-2">
              {newsBadgeLabel}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight line-clamp-2 break-words group-hover/title:text-accent transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
              {currentNews.title}
            </h1>
          </Link>

          <ProgressIndicators className="mt-4" />
        </div>

        <Navigation />
      </div>
    );
  }

  // ============================================
  // VARIANT 2: CARD - контент в карточке
  // ============================================
  if (HERO_VARIANT === 'card') {
    return (
      <div
        className="relative w-full h-[450px] rounded-2xl overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <BackgroundImages />

        {/* Карточка с контентом */}
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-md">
          <div className="backdrop-blur-md bg-white/95 rounded-xl p-5 shadow-xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                {newsBadgeLabel}
              </span>
              <span className="text-gray-500 text-xs">
                {formatNewsDate(currentNews.publish_date, i18n.language)}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-primary leading-tight mb-3 line-clamp-2">
              {currentNews.title}
            </h1>

            <div className="flex items-center justify-between">
              <Link
                href={`/news/${currentNews.id}`}
                className="inline-flex items-center space-x-2 text-primary hover:text-accent font-medium transition-colors"
              >
                <span>{t('buttons.readMore')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <ProgressIndicators />
            </div>
          </div>
        </div>

        <Navigation />
      </div>
    );
  }

  // ============================================
  // VARIANT 3: MINIMAL - только заголовок
  // ============================================
  if (HERO_VARIANT === 'minimal') {
    return (
      <div
        className="relative w-full h-[450px] rounded-2xl overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <BackgroundImages />

        {/* Минимальный градиент */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Минимальный контент */}
        <Link
          href={`/news/${currentNews.id}`}
          className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between group/link"
        >
          <h1 className="text-xl md:text-2xl font-bold text-white leading-tight max-w-3xl line-clamp-1 group-hover/link:text-accent transition-colors">
            {currentNews.title}
          </h1>
          <div className="ml-4 flex items-center space-x-3">
            <ProgressIndicators />
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover/link:bg-accent transition-all">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </Link>

        <Navigation />

        {/* Категория в углу */}
        <div className="absolute top-4 left-4">
          <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">
            {newsBadgeLabel}
          </span>
        </div>
      </div>
    );
  }

  // ============================================
  // VARIANT 4: SPLIT - фото справа, контент слева
  // ============================================
  if (HERO_VARIANT === 'split') {
    return (
      <div
        className="relative w-full h-[450px] rounded-2xl overflow-hidden group flex"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Левая часть - контент */}
        <div className="w-full md:w-2/5 bg-primary p-8 flex flex-col justify-center relative z-10">
          <span className="inline-block bg-accent text-white text-xs font-bold px-2 py-1 rounded w-fit mb-3">
            {newsBadgeLabel}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4 line-clamp-3">
            {currentNews.title}
          </h1>

          <p className="text-white/70 text-sm mb-6">
            {formatNewsDate(currentNews.publish_date, i18n.language)}
          </p>

          <Link
            href={`/news/${currentNews.id}`}
            className="inline-flex items-center space-x-2 text-white hover:text-accent font-medium transition-colors w-fit"
          >
            <span>{t('buttons.readMore')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <ProgressIndicators className="mt-auto pt-6" />
        </div>

        {/* Правая часть - фото */}
        <div className="hidden md:block w-3/5 relative">
          <BackgroundImages />
        </div>

        {/* На мобильных - фото как фон */}
        <div className="absolute inset-0 md:hidden -z-10">
          <BackgroundImages />
          <div className="absolute inset-0 bg-primary/90" />
        </div>

        <Navigation />
      </div>
    );
  }

  return null;
}
