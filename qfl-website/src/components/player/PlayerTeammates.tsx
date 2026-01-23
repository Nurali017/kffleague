import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SquadPlayer } from '@/types/team';

interface PlayerTeammatesProps {
    teammates: SquadPlayer[];
    teamId: number;
}

export function PlayerTeammates({ teammates, teamId }: PlayerTeammatesProps) {
    if (!teammates || teammates.length === 0) return null;

    return (
        <div className="w-full bg-[#0D47A1] text-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-6 md:py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg md:text-[18px] font-bold">Команданың басқа ойыншылары</h2>
                    <Link
                        href={`/team/${teamId}`}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1565C0] hover:bg-[#1E88E5] transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 text-white" />
                    </Link>
                </div>

                {/* Carousel */}
                <div className="flex overflow-x-auto gap-4 pb-4 md:pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {teammates.map((player) => (
                        <Link
                            key={player.player_id}
                            href={`/player/${player.player_id}`}
                            className="flex-shrink-0 group rounded-xl overflow-hidden bg-[#1565C0] w-[140px] h-[220px] md:w-[200px] md:h-[280px] relative transition-transform hover:-translate-y-1"
                        >
                            {/* Photo Area */}
                            <div className="relative w-full h-[140px] md:h-[200px] bg-gradient-to-b from-[#1E88E5] to-[#1565C0]">
                                {player.photo_url ? (
                                    <Image
                                        src={player.photo_url}
                                        alt={player.last_name}
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 768px) 140px, 200px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-30">
                                        <span className="text-4xl">👤</span>
                                    </div>
                                )}
                                {/* Large Number Overlay */}
                                <div className="absolute bottom-[-10px] right-2 text-5xl md:text-[64px] font-bold text-white/10 group-hover:text-white/20 transition-colors leading-none z-10">
                                    {player.jersey_number}
                                </div>
                            </div>

                            {/* Info Bottom */}
                            <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 bg-[#0D47A1] z-20 h-[80px] flex flex-col justify-center">
                                <h3 className="text-sm md:text-[14px] font-semibold text-white leading-tight mb-1 line-clamp-2">
                                    {player.first_name} {player.last_name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] md:text-[11px] text-[#90CAF9] font-medium">
                                        {player.position}
                                    </span>
                                    {player.age && (
                                        <span className="text-[10px] md:text-[11px] text-[#90CAF9]/80">
                                            {player.age} жас
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
