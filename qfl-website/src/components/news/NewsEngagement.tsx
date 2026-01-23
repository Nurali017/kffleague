'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NewsEngagementProps {
  newsId: number;
  initialLikes?: number;
  initialLiked?: boolean;
  onLike?: () => Promise<void>;
  className?: string;
}

export function NewsEngagement({
  newsId,
  initialLikes = 0,
  initialLiked = false,
  onLike,
  className = '',
}: NewsEngagementProps) {
  const { t } = useTranslation();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;

    // Optimistic update
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;

    setLiked(newLiked);
    setLikes(newLikes);
    setIsAnimating(true);

    setTimeout(() => setIsAnimating(false), 600);

    if (onLike) {
      setIsLoading(true);
      try {
        await onLike();
      } catch (error) {
        // Revert on error
        setLiked(!newLiked);
        setLikes(newLiked ? newLikes - 1 : newLikes + 1);
        console.error('Failed to toggle like:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`
          group flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
          ${
            liked
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
              : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label={liked ? t('news.unlike', 'Убрать лайк') : t('news.like', 'Поставить лайк')}
      >
        <Heart
          className={`
            w-5 h-5 transition-all duration-200
            ${liked ? 'fill-current' : ''}
            ${isAnimating ? 'scale-125' : 'group-hover:scale-110'}
          `}
        />
        <span className="font-semibold">
          {likes > 0 ? likes : t('news.likes', 'Нравится')}
        </span>
      </button>

      {/* Animation Effect */}
      {isAnimating && (
        <div className="absolute pointer-events-none">
          <Heart
            className="w-8 h-8 fill-current text-red-500 animate-ping opacity-75"
            style={{ animationDuration: '0.6s' }}
          />
        </div>
      )}
    </div>
  );
}
