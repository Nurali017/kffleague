'use client';

// Mock function until we have real API for league info
function getLeagueIcon(leagueName: string) {
    // Simple mapping based on known league names
    if (leagueName.includes('Premier') || leagueName.includes('Премьер')) return '🏆';
    if (leagueName.includes('Cup') || leagueName.includes('Кубок')) return '🥤';
    return '⚽';
}

interface LeagueBadgeProps {
    leagueName: string;
    tour?: number | string;
    className?: string;
}

export function LeagueBadge({ leagueName, tour, className = '' }: LeagueBadgeProps) {
    return (
        <div className={`
      inline-flex items-center gap-2 
      bg-white/10 backdrop-blur-md border border-white/20 
      rounded-full px-4 py-1.5 
      text-white text-xs font-semibold uppercase tracking-wide
      ${className}
    `}>
            <span className="text-base leading-none drop-shadow-sm">{getLeagueIcon(leagueName)}</span>
            <span className="drop-shadow-sm">
                {leagueName} {tour ? `• Тур ${tour}` : ''}
            </span>
        </div>
    );
}
