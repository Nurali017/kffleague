'use client';

import { useTranslation } from 'react-i18next';
import { MatchDetail } from '@/types';
import { getTeamLogo, HOME_COLOR, AWAY_COLOR } from '@/lib/utils/teamLogos';

interface MatchStatisticsTabProps {
    match: MatchDetail;
}

// SVG Progress Circle for possession
function ProgressCircle({ value, color }: { value: number; color: string }) {
    const size = 56;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 100) * circumference;
    const center = size / 2;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full -rotate-90">
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
                {value}
            </span>
        </div>
    );
}

// Simple stat row with numbers and bar
function SimpleStatRow({
    label,
    homeValue,
    awayValue,
    homeColor,
    awayColor
}: {
    label: string;
    homeValue: number;
    awayValue: number;
    homeColor: string;
    awayColor: string;
}) {
    const total = homeValue + awayValue;
    const homePercent = total === 0 ? 50 : (homeValue / total) * 100;
    const awayPercent = total === 0 ? 50 : (awayValue / total) * 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700 w-8">{homeValue}</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">{awayValue}</span>
            </div>

            <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-100">
                <div
                    className="transition-all duration-700 ease-out rounded-l-full"
                    style={{ width: `${homePercent}%`, backgroundColor: homeColor }}
                />
                <div
                    className="transition-all duration-700 ease-out rounded-r-full"
                    style={{ width: `${awayPercent}%`, backgroundColor: awayColor }}
                />
            </div>
        </div>
    );
}

export function MatchStatisticsTab({ match }: MatchStatisticsTabProps) {
    const { t } = useTranslation('match');
    const { home_team, away_team, stats } = match;

    const homeColor = HOME_COLOR;
    const awayColor = AWAY_COLOR;
    const homeLogo = home_team.logo_url || getTeamLogo(home_team.id);
    const awayLogo = away_team.logo_url || getTeamLogo(away_team.id);

    const getStat = (category: keyof NonNullable<typeof stats>, team: 'home' | 'away') => {
        if (!stats || !stats[category]) return 0;
        return stats[category][team] || 0;
    };

    if (!stats) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-gray-500">{t('statisticsTab.notAvailable')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header with team logos */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center">
                        {homeLogo && <img src={homeLogo} className="w-full h-full object-contain" alt={home_team.name} />}
                    </div>
                    <span className="font-bold text-gray-900 hidden md:inline">{home_team.name}</span>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">{t('statisticsTab.title')}</h3>

                <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 hidden md:inline">{away_team.name}</span>
                    <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center">
                        {awayLogo && <img src={awayLogo} className="w-full h-full object-contain" alt={away_team.name} />}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Possession with circles */}
                <div className="flex items-center gap-4">
                    <ProgressCircle value={getStat('possession', 'home')} color={homeColor} />
                    <div className="flex-1">
                        <p className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {t('statisticsTab.possessionPercent')}
                        </p>
                    </div>
                    <ProgressCircle value={getStat('possession', 'away')} color={awayColor} />
                </div>

                <SimpleStatRow
                    label={t('shots')}
                    homeValue={getStat('shots', 'home')}
                    awayValue={getStat('shots', 'away')}
                    homeColor={homeColor}
                    awayColor={awayColor}
                />

                <SimpleStatRow
                    label={t('shotsOnTarget')}
                    homeValue={getStat('shots_on_target', 'home')}
                    awayValue={getStat('shots_on_target', 'away')}
                    homeColor={homeColor}
                    awayColor={awayColor}
                />

                <SimpleStatRow
                    label={t('statisticsTab.shotsMissed')}
                    homeValue={getStat('shots', 'home') - getStat('shots_on_target', 'home')}
                    awayValue={getStat('shots', 'away') - getStat('shots_on_target', 'away')}
                    homeColor={homeColor}
                    awayColor={awayColor}
                />

                <div className="h-px bg-gray-100 my-4" />

                <SimpleStatRow
                    label={t('corners')}
                    homeValue={getStat('corners', 'home')}
                    awayValue={getStat('corners', 'away')}
                    homeColor={homeColor}
                    awayColor={awayColor}
                />

                <SimpleStatRow
                    label={t('offsides')}
                    homeValue={getStat('offsides', 'home')}
                    awayValue={getStat('offsides', 'away')}
                    homeColor={homeColor}
                    awayColor={awayColor}
                />

                <div className="h-px bg-gray-100 my-4" />

                <SimpleStatRow
                    label={t('fouls')}
                    homeValue={getStat('fouls', 'home')}
                    awayValue={getStat('fouls', 'away')}
                    homeColor={homeColor}
                    awayColor={awayColor}
                />

                <SimpleStatRow
                    label={t('yellowCards')}
                    homeValue={getStat('yellow_cards', 'home')}
                    awayValue={getStat('yellow_cards', 'away')}
                    homeColor={homeColor}
                    awayColor={awayColor}
                />

                <SimpleStatRow
                    label={t('redCards')}
                    homeValue={getStat('red_cards', 'home')}
                    awayValue={getStat('red_cards', 'away')}
                    homeColor={homeColor}
                    awayColor={awayColor}
                />
            </div>
        </div>
    );
}
