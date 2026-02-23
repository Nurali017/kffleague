'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

interface StatBarProps {
    label: string;
    homeValue: number;
    awayValue: number;
    homeColor: string;
    awayColor: string;
    showValues?: boolean;
    animated?: boolean;
}

export function StatBar({
    label,
    homeValue,
    awayValue,
    homeColor,
    awayColor,
    showValues = true,
    animated = false,
}: StatBarProps) {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;

    const total = homeValue + awayValue;
    const homePercent = total === 0 ? 50 : Math.min((homeValue / total) * 100, 100);
    const awayPercent = total === 0 ? 50 : Math.min((awayValue / total) * 100, 100);

    const homeWin = homeValue > awayValue;
    const awayWin = awayValue > homeValue;

    const homeBarWidth = `${(homeValue / Math.max(homeValue, awayValue, 1)) * 100}%`;
    const awayBarWidth = `${(awayValue / Math.max(homeValue, awayValue, 1)) * 100}%`;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                {showValues && (
                    <span
                        className="w-8 font-bold"
                        style={{ color: homeWin ? homeColor : '#6B7280' }}
                    >
                        {homeValue}
                    </span>
                )}

                <span className="flex-1 text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
                    {label}
                </span>

                {showValues && (
                    <span
                        className="w-8 text-right font-bold"
                        style={{ color: awayWin ? awayColor : '#6B7280' }}
                    >
                        {awayValue}
                    </span>
                )}
            </div>

            <div className="flex h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="flex justify-end transition-all duration-1000 ease-out"
                    style={{ width: '50%' }}
                >
                    {shouldAnimate ? (
                        <motion.div
                            className="h-full rounded-l-full"
                            style={{
                                backgroundColor: homeColor,
                                opacity: homeWin ? 1 : 0.6,
                            }}
                            initial={{ width: '0%' }}
                            whileInView={{ width: homeBarWidth }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    ) : (
                        <div
                            className="h-full rounded-l-full"
                            style={{
                                backgroundColor: homeColor,
                                width: homeBarWidth,
                                opacity: homeWin ? 1 : 0.6,
                            }}
                        />
                    )}
                </div>

                <div className="w-0.5 bg-white z-10" />

                <div
                    className="flex justify-start transition-all duration-1000 ease-out"
                    style={{ width: '50%' }}
                >
                    {shouldAnimate ? (
                        <motion.div
                            className="h-full rounded-r-full"
                            style={{
                                backgroundColor: awayColor,
                                opacity: awayWin ? 1 : 0.6,
                            }}
                            initial={{ width: '0%' }}
                            whileInView={{ width: awayBarWidth }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    ) : (
                        <div
                            className="h-full rounded-r-full"
                            style={{
                                backgroundColor: awayColor,
                                width: awayBarWidth,
                                opacity: awayWin ? 1 : 0.6,
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
