'use client';

import { Play } from 'lucide-react';

interface MatchVideoCardProps {
  videoUrl?: string;
  thumbnailUrl?: string;
}

export function MatchVideoCard({ videoUrl, thumbnailUrl }: MatchVideoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <h3 className="text-base font-bold text-gray-900">Видеообзор матча</h3>
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">
          {/* YouTube Logo Svg */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wide">YouTube</span>
        </div>
      </div>

      {/* Video Player Container */}
      <div className="relative aspect-video bg-gray-900 flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
          />
        ) : (
          // Default cinematic gradient if no thumb
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-[#1E4D8C] to-black opacity-80"></div>
        )}

        {/* Dark overlay for better button contrast */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>

        {/* Play Button */}
        <button
          onClick={() => videoUrl && window.open(videoUrl, '_blank')}
          className="relative z-10 w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] group/btn"
        >
          <Play className="w-8 h-8 text-white fill-white ml-1 group-hover/btn:scale-110 transition-transform" />

          {/* Ripple effect rings */}
          <span className="absolute -inset-4 rounded-full border-2 border-white/20 animate-ping opacity-20"></span>
        </button>
      </div>
    </div>
  );
}
