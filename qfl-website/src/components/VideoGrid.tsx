'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { imageZoom, scaleHover, modalBackdrop, modalContent } from '@/lib/motion';

type Video = {
  id: number;
  title: string;
  youtubeId: string;
  category?: string;
};

interface VideoGridProps {
  title: string;
  videos: Video[];
}

export function VideoGrid({ title, videos }: VideoGridProps) {
  const { t } = useTranslation();
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const getYoutubeThumbnail = (youtubeId: string) =>
    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1E4D8C]">
            {title}
          </h2>
          <motion.button
            className="text-gray-500 font-medium text-sm hover:text-[#1E4D8C] flex items-center group"
            whileHover={{ color: '#1E4D8C' }}
          >
            {t('buttons.allVideos')}
            <motion.svg
              className="w-4 h-4 ml-0.5"
              whileHover={{ x: 2 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="group cursor-pointer"
              onClick={() => setActiveVideo(video)}
            >
              <div className="relative rounded-lg overflow-hidden mb-3 aspect-video bg-gray-900">
                <motion.img
                  src={getYoutubeThumbnail(video.youtubeId)}
                  alt={video.title}
                  loading="lazy"
                  variants={imageZoom}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-black/20"
                  initial={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                  transition={{ duration: 0.3 }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    variants={scaleHover}
                    className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </motion.div>
                </div>

                {video.category && (
                  <div className="absolute top-2 left-2 bg-[#E5B73B] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {video.category}
                  </div>
                )}
              </div>

              <motion.h3
                className="font-bold text-[#1E4D8C] leading-snug mb-2 line-clamp-2"
                whileHover={{ color: '#E5B73B' }}
                transition={{ duration: 0.3 }}
              >
                {video.title}
              </motion.h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* YouTube Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalBackdrop}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalContent}
              className="relative w-full max-w-4xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="absolute -top-12 right-0 text-white"
                whileHover={{ color: '#E5B73B', scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveVideo(null)}
              >
                <X className="w-8 h-8" />
              </motion.button>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <h3 className="text-white text-lg font-bold mt-4">{activeVideo.title}</h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
