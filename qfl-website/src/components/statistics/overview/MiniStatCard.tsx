'use client';

import { TournamentAwareLink as Link } from '@/components/navigation/TournamentAwareLink';

interface MiniStatCardProps {
  title: string;
  imageUrl?: string | null;
  name: string;
  sublabel?: string;
  value: number | string;
  href?: string | null;
  bgColor?: string;
}

const PLACEHOLDER_IMG = '/images/placeholders/team.svg';

export function MiniStatCard({
  title,
  imageUrl,
  name,
  sublabel,
  value,
  href,
  bgColor = 'bg-gray-100 dark:bg-dark-surface-soft',
}: MiniStatCardProps) {
  const content = (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 px-3 pt-3 pb-2">
        {title}
      </div>

      <div className={`${bgColor} mx-3 rounded-lg h-28 flex items-center justify-center overflow-hidden`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain object-center"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMG;
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-dark-border flex items-center justify-center">
            <span className="text-gray-400 dark:text-slate-500 text-xl font-bold">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="px-3 pt-2 pb-3">
        {sublabel && (
          <div className="text-[9px] text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            {sublabel}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate">
            {name}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-sm font-bold text-gray-900 dark:text-slate-100">
              {value}
            </span>
            <span className="text-gray-400 dark:text-slate-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-accent-cyan"
      aria-label={name}
    >
      {content}
    </Link>
  );
}
