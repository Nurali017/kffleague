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
        <div className="h-[200px] w-full items-center justify-center text-xs">
            <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-white/80 font-medium">
                    {t('hero.goalsByPeriodTitle', { defaultValue: 'When the goals were scored' })}
                </div>
                {meta && (
                    <div className="shrink-0 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] text-white/80">
                        {t('hero.goalsByPeriodCoverage', {
                            defaultValue: 'Coverage: {{coverage}}% ({{withEvents}}/{{total}})',
                            coverage: Math.round(meta.coverage_pct),
                            withEvents: meta.matches_with_goal_events,
                            total: meta.matches_played,
                        })}
                    </div>
                )}
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: -20,
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
                    <Bar dataKey="goals" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={'#60A5FA'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
