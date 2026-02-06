'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';
import { useNewsById } from '@/hooks';
import { useNewsReactions } from '@/hooks/useNewsReactions';
import { useNewsNavigation } from '@/hooks/useNewsNavigation';
import { NewsEngagement } from '@/components/news/NewsEngagement';
import { ShareButtons } from '@/components/news/ShareButtons';
import { NewsNavigation } from '@/components/news/NewsNavigation';
import { ImageGallery } from '@/components/news/ImageGallery';
import { HeroBackground } from '@/components/ui/HeroBackground';
import { formatNewsDate } from '@/lib/utils/dateFormat';
import { fadeInUp, staggerContainer } from '@/lib/motion/variants';

function NewsDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="relative">
        <HeroBackground
          className="absolute inset-x-0 top-0 h-[280px] md:h-[360px]"
          patternClassName="absolute inset-x-0 top-0 h-[280px] md:h-[360px]"
        />
        <div className="relative z-10 max-w-[900px] mx-auto px-4 pt-6 md:pt-8 pb-10">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 bg-white/20 rounded" />
            <div className="h-6 w-24 bg-white/20 rounded" />
            <div className="h-10 w-3/4 bg-white/20 rounded" />
            <div className="h-4 w-48 bg-white/20 rounded" />
          </div>
        </div>
      </div>
      <div className="max-w-[900px] mx-auto px-4 -mt-4 pb-8">
        <div className="animate-pulse space-y-4 bg-white dark:bg-dark-surface rounded-2xl p-6">
          <div className="h-[300px] bg-gray-200 dark:bg-dark-surface-soft rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-dark-surface-soft rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-dark-surface-soft rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-dark-surface-soft rounded w-4/6" />
            <div className="h-4 bg-gray-200 dark:bg-dark-surface-soft rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-dark-surface-soft rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsNotFound() {
  const { t } = useTranslation('news');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
          <span className="text-3xl text-gray-400 dark:text-slate-500">?</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t('noResults')}
        </h1>
        <Link
          href="/news"
          className="inline-flex items-center min-h-[44px] px-4 py-2 text-primary hover:text-primary-light dark:text-accent-cyan dark:hover:text-cyan-200 font-medium transition-colors rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('title')}
        </Link>
      </div>
    </main>
  );
}

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params?.id ? Number(params.id) : null;
  const { t, i18n } = useTranslation('news');
  const viewTracked = useRef(false);

  const { news, loading, error } = useNewsById(newsId);
  const { reactions, incrementView, toggleLike } = useNewsReactions(newsId);
  const { navigation } = useNewsNavigation(newsId);

  // Track view once per page load
  useEffect(() => {
    if (news && !viewTracked.current) {
      viewTracked.current = true;
      incrementView();
    }
  }, [news, incrementView]);

  if (loading) {
    return <NewsDetailSkeleton />;
  }

  if (error || !news) {
    return <NewsNotFound />;
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `/news/${news.id}`;
  const galleryImages = news.images?.map((img) => img.url) ?? [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero Section */}
      <div className="relative">
        <HeroBackground
          className="absolute inset-x-0 top-0 h-[280px] md:h-[360px]"
          patternClassName="absolute inset-x-0 top-0 h-[280px] md:h-[360px]"
        />
        <div className="relative z-10 max-w-[900px] mx-auto px-4 pt-6 md:pt-8 pb-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-3"
          >
            {/* Breadcrumb */}
            <motion.nav variants={fadeInUp} className="flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white transition-colors">
                Басты бет
              </Link>
              <span>/</span>
              <Link href="/news" className="hover:text-white transition-colors">
                {t('title')}
              </Link>
            </motion.nav>

            {/* Article type badge */}
            {news.article_type && (
              <motion.div variants={fadeInUp}>
                <span
                  className={`inline-block px-3 py-1 text-white text-xs font-bold rounded uppercase ${
                    news.article_type === 'NEWS' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}
                >
                  {news.article_type === 'NEWS' ? t('typeNews') : t('typeAnalytics')}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-2xl md:text-4xl font-bold text-white leading-tight"
            >
              {news.title}
            </motion.h1>

            {/* Meta info */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-4 text-white/80 text-sm"
            >
              {news.publish_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatNewsDate(news.publish_date, i18n.language)}
                </span>
              )}
              {reactions.views > 0 && (
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {reactions.views}
                </span>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-[900px] mx-auto px-4 -mt-4 md:-mt-6 pb-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden"
        >
          {/* Main Image */}
          {news.image_url && (
            <div className="relative h-[250px] md:h-[450px] overflow-hidden">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="p-6 md:p-10">
            {news.content && (
              <div
                className="news-content text-gray-700 dark:text-slate-300 text-base md:text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            )}

            {/* Image Gallery */}
            {galleryImages.length > 1 && (
              <ImageGallery
                images={galleryImages}
                alt={news.title}
                className="mt-8"
              />
            )}
          </div>
        </motion.article>

        {/* Engagement Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
          <NewsEngagement
            newsId={news.id}
            initialLikes={reactions.likes}
            initialLiked={reactions.liked}
            onLike={toggleLike}
          />
          <ShareButtons
            url={shareUrl}
            title={news.title}
            description={news.excerpt}
          />
        </div>

        {/* Previous / Next Navigation */}
        <NewsNavigation navigation={navigation} className="mt-8" />

        {/* Back to News */}
        <div className="mt-8">
          <Link
            href="/news"
            className="inline-flex items-center min-h-[44px] px-2 py-2 text-primary hover:text-primary-light dark:text-accent-cyan dark:hover:text-cyan-200 font-medium transition-colors rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('title')}
          </Link>
        </div>
      </div>
    </div>
  );
}
