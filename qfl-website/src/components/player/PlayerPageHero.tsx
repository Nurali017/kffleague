import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { PlayerDetail } from '@/types/player';
import { TeamDetail } from '@/types/team';

interface PlayerPageHeroProps {
    player: PlayerDetail;
    team?: TeamDetail | null;
}

export function PlayerPageHero({ player, team }: PlayerPageHeroProps) {
    // Mock data for missing fields if necessary
    const isHomegrown = true; // TODO: Add to PlayerDetail type or fetch
    const country = player.nationality || 'Kazakhstan';

    // Calculate age if DOB is available
    const getAge = (dob?: string) => {
        if (!dob) return '';
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = getAge(player.date_of_birth);
    const teamName = team?.name || player.team_name || 'Team';
    const teamId = team?.id || player.team_id;

    return (
        <div className="relative w-full bg-gradient-to-r from-[#0055D4] to-[#0099FF] text-white overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-1/2 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 md:py-12 relative z-10">

                {/* Back Navigation */}
                <div className="mb-6">
                    <Link
                        href={`/team/${teamId}`}
                        className="inline-flex items-center text-white/70 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Кері қайту
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 md:gap-12">
                    {/* Left Content */}
                    <div className="flex-1 text-center md:text-left">

                        {/* Name and Badges */}
                        <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-2">
                            <h1 className="text-3xl md:text-5xl font-black leading-tight">
                                {player.first_name} {player.last_name}
                            </h1>

                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center bg-white text-[#0055D4] font-black text-lg md:text-xl w-10 h-10 rounded-full shadow-lg">
                                    {player.jersey_number || '-'}
                                </span>

                                {isHomegrown && (
                                    <span className="flex items-center justify-center bg-[#E53935] text-white font-bold text-xs px-2 py-1 rounded shadow-sm uppercase tracking-wide">
                                        HG
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Club and League Info */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 inline-flex items-center gap-3 mb-4">
                            {/* Team Logo Mock */}
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                                {/* <img src={...} /> */}
                                <span className="text-[#0055D4] font-bold text-[10px]">FC</span>
                            </div>
                            <div className="flex flex-col items-start leading-none">
                                <span className="font-bold text-sm md:text-base">{teamName}</span>
                                <span className="text-[10px] md:text-xs text-white/70">Freedom QJ League 2025</span>
                            </div>
                        </div>

                        {/* Position */}
                        <div className="text-white/80 font-bold text-lg mb-6">
                            {player.position}
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-3 gap-6 md:gap-12 border-t border-white/10 pt-4 md:w-fit">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Туған күні</span>
                                <span className="font-bold text-sm md:text-base">
                                    {player.date_of_birth ? new Date(player.date_of_birth).toLocaleDateString() : '-'}
                                    {age && <span className="opacity-70 ml-1">· {age} жас</span>}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Бой, салмақ</span>
                                <span className="font-bold text-sm md:text-base">
                                    {player.height} см, {player.weight} кг
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Азаматтық</span>
                                <span className="flex items-center gap-2 font-bold text-sm md:text-base">
                                    {country}
                                    {/* Flag icon could go here */}
                                    <span className="text-[10px] bg-white/20 px-1 rounded">kz</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Player Photo */}
                    <div className="relative shrink-0">
                        {/* Gradient behind photo */}
                        <div className="absolute inset-x-4 bottom-0 h-32 bg-white/20 blur-2xl rounded-full"></div>

                        <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px]">
                            {player.photo_url ? (
                                <Image
                                    src={player.photo_url}
                                    alt={`${player.first_name} ${player.last_name}`}
                                    fill
                                    className="object-contain object-bottom drop-shadow-2xl"
                                    priority
                                    sizes="(max-width: 768px) 280px, 320px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/10 rounded-full">
                                    <span className="text-6xl">👤</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
