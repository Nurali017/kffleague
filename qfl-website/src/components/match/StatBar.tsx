'use client';

interface StatBarProps {
    label: string;
    homeValue: number;
    awayValue: number;
    homeColor: string;
    awayColor: string;
    showValues?: boolean;
}

export function StatBar({
    label,
    homeValue,
    awayValue,
    homeColor,
    awayColor,
    showValues = true
}: StatBarProps) {

    const total = homeValue + awayValue;
    // Prevent division by zero, default to 50%
    const homePercent = total === 0 ? 50 : Math.min((homeValue / total) * 100, 100);
    const awayPercent = total === 0 ? 50 : Math.min((awayValue / total) * 100, 100);

    const homeWin = homeValue > awayValue;
    const awayWin = awayValue > homeValue;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                {showValues && (
                    <span className={`w-8 font-bold ${homeWin ? 'text-gray-900' : 'text-gray-500'}`}>
                        {homeValue}
                    </span>
                )}

                <span className="flex-1 text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
                    {label}
                </span>

                {showValues && (
                    <span className={`w-8 text-right font-bold ${awayWin ? 'text-gray-900' : 'text-gray-500'}`}>
                        {awayValue}
                    </span>
                )}
            </div>

            <div className="flex h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="flex justify-end transition-all duration-1000 ease-out"
                    style={{ width: '50%' }}
                >
                    <div
                        className="h-full rounded-l-full"
                        style={{
                            backgroundColor: homeColor,
                            width: `${(homeValue / Math.max(homeValue, awayValue)) * 100}%`,
                            opacity: homeWin ? 1 : 0.6
                        }}
                    />
                </div>

                <div className="w-0.5 bg-white z-10" />

                <div
                    className="flex justify-start transition-all duration-1000 ease-out"
                    style={{ width: '50%' }}
                >
                    <div
                        className="h-full rounded-r-full"
                        style={{
                            backgroundColor: awayColor,
                            width: `${(awayValue / Math.max(homeValue, awayValue)) * 100}%`,
                            opacity: awayWin ? 1 : 0.6
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
