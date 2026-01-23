'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import { motion } from 'motion/react';
import { cardLift, imageZoom } from '@/lib/motion';
import { LeadershipMember } from '@/types';

interface LeadershipCardProps {
  member: LeadershipMember;
}

export function LeadershipCard({ member }: LeadershipCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="group h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
      variants={{
        rest: {
          y: 0,
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          transition: { duration: 0.3 },
        },
        hover: {
          y: -4,
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
          transition: { duration: 0.3 },
        },
      }}
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-[#1E4D8C] to-[#163a6b] overflow-hidden flex-shrink-0">
        {member.photo && !imageError ? (
          <>
            <motion.img
              src={member.photo}
              alt={member.name}
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.05, transition: { duration: 0.5 } },
              }}
              className="w-full h-full object-cover object-top"
              onError={() => setImageError(true)}
            />
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-20 h-20 text-white/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
          {member.name}
        </h3>

        {/* Position Badge */}
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold text-[#1E4D8C] bg-[#E5B73B]/20 rounded-full">
            {member.position}
          </span>
        </div>

        {/* Bio */}
        {member.bio && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {member.bio}
          </p>
        )}
      </div>
    </motion.div>
  );
}
