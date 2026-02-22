'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface PlayerAvatarProps {
  photoUrl?: string | null;
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  className?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-11 h-11',
  xl: 'w-20 h-20',
};

function SilhouetteSvg() {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[60%] h-[60%] text-slate-400 dark:text-white/40"
    >
      <circle cx="18" cy="12" r="6" fill="currentColor" />
      <path
        d="M6 32c0-6.627 5.373-12 12-12s12 5.373 12 12"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayerAvatar({
  photoUrl,
  firstName,
  lastName,
  size = 'md',
  className,
}: PlayerAvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImage = photoUrl && !broken;
  const alt = [firstName, lastName].filter(Boolean).join(' ') || '';

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 border border-gray-200 dark:border-white/15 shrink-0 flex items-center justify-center',
        SIZE_CLASSES[size],
        className,
      )}
    >
      {showImage ? (
        <img
          src={photoUrl}
          alt={alt}
          className="w-full h-full object-cover object-top"
          onError={() => setBroken(true)}
        />
      ) : (
        <SilhouetteSvg />
      )}
    </div>
  );
}
