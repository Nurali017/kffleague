'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useSliderNews } from '@/hooks';
import { HeroSkeleton } from '@/components/ui/Skeleton';
import { formatNewsDate } from '@/lib/utils/dateFormat';

const SLIDE_DURATION = 6000;

// Change this to switch between variants: 'compact' | 'card' | 'minimal' | 'split'
const HERO_VARIANT: 'compact' | 'card' | 'minimal' | 'split' = 'compact';

export function HeroSection() {
  const { t, i18n } = useTranslation();
  const { sliderNews, loading, error } = useSliderNews({ limit: 5 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const goToNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % sliderNews.length);
    setProgress(0);
  }, [sliderNews.length]);

  const goToPrevious = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev === 0 ? sliderNews.length - 1 : prev - 1));
    setProgress(0);
  }, [sliderNews.length]);

  useEffect(() => {
    if (sliderNews.length === 0 || isPaused) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [sliderNews.length, isPaused, goToNext]);

  if (loading) {
    return <HeroSkeleton />;
  }

  if (error || sliderNews.length === 0) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E4D8C] to-[#0D2847] dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
        <p className="text-white/70">{t('noData.noNews')}</p>
      </div>
    );
  }

  const currentNews = sliderNews[currentIndex];

  // Navigation component (reused across variants)
  const Navigation = () =>
    sliderNews.length > 1 && (
      <>
        <motion.button
          onClick={goToPrevious}
          aria-label="Предыдущий слайд"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          onClick={goToNext}
          aria-label="Следующий слайд"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      </>
    );

  // Progress indicators (reused across variants)
  const ProgressIndicators = ({ className = '' }: { className?: string }) =>
    sliderNews.length > 1 && (
      <div className={`flex items-center space-x-1.5 ${className}`}>
        {sliderNews.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection('next');
              setCurrentIndex(index);
              setProgress(0);
            }}
            aria-label={`Перейти к слайду ${index + 1}`}
            className="relative h-1 rounded-full overflow-hidden bg-white/30"
            animate={{
              width: index === currentIndex ? '32px' : '16px',
            }}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            {index === currentIndex && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#E5B73B] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            )}
          </motion.button>
        ))}
      </div>
    );

  // Background images component with smooth pan animation synced to progress
  const BackgroundImages = () => {
    // Calculate smooth transform based on progress (0-100)
    // Pan from slight left to slight right while zooming in
    const scale = 1 + (progress / 100) * 0.08; // 1 -> 1.08
    const translateX = -2 + (progress / 100) * 4; // -2% -> 2%
    const translateY = (progress / 100) * -1; // 0% -> -1% (slight up movement)

    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.img
            src={sliderNews[currentIndex].image_url || '/images/news-placeholder.svg'}
            alt={sliderNews[currentIndex].title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            animate={{
              scale: scale,
              x: `${translateX}%`,
              y: `${translateY}%`,
            }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </motion.div>
      </AnimatePresence>
    );
  };

  // ============================================
  // VARIANT 1: COMPACT - минимум элементов внизу
  // ============================================
  if (HERO_VARIANT === 'compact') {
    return (
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <BackgroundImages />

        {/* Мягкий градиент внизу */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

        {/* Компактный контент с blur */}
        <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-[2px]">
          <Link href={`/news/${currentNews.id}`} className="block max-w-2xl group/title">
            <span className="inline-block bg-[#E5B73B] text-white text-xs font-bold px-2 py-1 rounded mb-2">
              {currentNews.category || t('news')}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight line-clamp-2 group-hover/title:text-[#E5B73B] transition-colors">
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
              <span className="bg-[#1E4D8C] text-white text-xs font-bold px-2 py-1 rounded">
                {currentNews.category || t('news')}
              </span>
              <span className="text-gray-500 text-xs">
                {formatNewsDate(currentNews.publish_date, i18n.language)}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-[#1E4D8C] leading-tight mb-3 line-clamp-2">
              {currentNews.title}
            </h1>

            <div className="flex items-center justify-between">
              <Link
                href={`/news/${currentNews.id}`}
                className="inline-flex items-center space-x-2 text-[#1E4D8C] hover:text-[#E5B73B] font-medium transition-colors"
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
          <h1 className="text-xl md:text-2xl font-bold text-white leading-tight max-w-3xl line-clamp-1 group-hover/link:text-[#E5B73B] transition-colors">
            {currentNews.title}
          </h1>
          <div className="ml-4 flex items-center space-x-3">
            <ProgressIndicators />
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover/link:bg-[#E5B73B] transition-all">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </Link>

        <Navigation />

        {/* Категория в углу */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#E5B73B] text-white text-xs font-bold px-2 py-1 rounded">
            {currentNews.category || t('news')}
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
        <div className="w-full md:w-2/5 bg-[#1E4D8C] p-8 flex flex-col justify-center relative z-10">
          <span className="inline-block bg-[#E5B73B] text-white text-xs font-bold px-2 py-1 rounded w-fit mb-3">
            {currentNews.category || t('news')}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4 line-clamp-3">
            {currentNews.title}
          </h1>

          <p className="text-white/70 text-sm mb-6">
            {formatNewsDate(currentNews.publish_date, i18n.language)}
          </p>

          <Link
            href={`/news/${currentNews.id}`}
            className="inline-flex items-center space-x-2 text-white hover:text-[#E5B73B] font-medium transition-colors w-fit"
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
          <div className="absolute inset-0 bg-[#1E4D8C]/90" />
        </div>

        <Navigation />
      </div>
    );
  }

  return null;
}
