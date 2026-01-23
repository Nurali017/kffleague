'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils/cn';

interface TeamPageTabsProps {
    activeTab: string;
    onChange: (tab: string) => void;
}

export function TeamPageTabs({ activeTab, onChange }: TeamPageTabsProps) {
    const { t } = useTranslation();

    const tabs = [
        { id: 'overview', label: t('team.tabs.description', 'Сипаттама') },
        { id: 'matches', label: t('team.tabs.calendar', 'Күнтізбе') },
        { id: 'squad', label: t('team.tabs.squad', 'Құрам') },
        { id: 'staff', label: t('team.tabs.staff', 'Қызметкерлер') },
        { id: 'transfers', label: t('team.tabs.transfers', 'Өтінімнен шығарылғандар') },
    ];

    return (
        <div className="bg-white border-b border-gray-100 mb-8">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => onChange(tab.id)}
                                className={cn(
                                    "relative py-4 text-sm font-bold transition-all whitespace-nowrap outline-none select-none",
                                    isActive
                                        ? "text-[#1E4D8C] border-b-4 border-[#1E4D8C]"
                                        : "text-gray-400 hover:text-gray-600 border-b-4 border-transparent"
                                )}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
