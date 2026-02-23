'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GoalsByPeriodData, GoalsByPeriodMeta } from '@/types/statistics';
import { useTranslation } from 'react-i18next';

interface GoalTimingChartProps {
    data: GoalsByPeriodData[];
    meta?: GoalsByPeriodMeta;
}

export function GoalTimingChart({ data, meta }: GoalTimingChartProps) {
    const { t } = useTranslation('statistics');

    return (
        <div className="w-full text-xs">
            <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="text-white/80 font-medium text-[11px] sm:text-xs">
                    {t('hero.goalsByPeriodTitle', { defaultValue: 'When the goals were scored' })}
                </div>
                {meta && (
                    <div className="inline-flex w-fit shrink-0 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] text-white/80 leading-tight">
                        {t('hero.goalsByPeriodCoverage', {
                            defaultValue: 'Coverage: {{coverage}}% ({{withEvents}}/{{total}})',
                            coverage: Math.round(meta.coverage_pct),
                            withEvents: meta.matches_with_goal_events,
                            total: meta.matches_played,
                        })}
                    </div>
                )}
            </div>
            <div className="h-[150px] sm:h-[170px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 6,
                            right: 4,
                            left: -10,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="period"
                            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{
                                backgroundColor: '#1E4D8C',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#E5B73B' }}
                        />
                        <Bar dataKey="goals" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={'#60A5FA'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
