import React from 'react';
import { PlayerMatchPerformance } from '@/types/player';

interface PlayerMatchesTableProps {
    matches: PlayerMatchPerformance[];
}

export function PlayerMatchesTable({ matches }: PlayerMatchesTableProps) {
    if (!matches || matches.length === 0) return null;

    return (
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#1E4D8C]">Матчтар</h3>
            </div>

            {/* Desktop Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4 text-left w-16">Тур</th>
                            <th className="px-6 py-4 text-left">Командалар</th>
                            <th className="px-6 py-4 text-center w-24">Есеп</th>
                            <th className="px-6 py-4 text-center">Матч күні</th>
                            <th className="px-6 py-4 text-center w-20">Мин</th>
                            <th className="px-4 py-4 text-center w-16 opacity-70">Г</th>
                            <th className="px-4 py-4 text-center w-16 opacity-70">НП</th>
                            <th className="px-4 py-4 text-center w-16 opacity-70">СҚ</th>
                            <th className="px-4 py-4 text-center w-16 opacity-70">ҚҚ</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                        {matches.map((match: any, index) => {
                            const round = match.round;
                            return (
                                <tr
                                    key={index}
                                    className="bg-white hover:bg-blue-50/50 border-b border-gray-100 last:border-0 transition-colors text-gray-700 group"
                                >
                                    <td className="px-6 py-4 text-gray-400 font-bold group-hover:text-[#1E4D8C] transition-colors">
                                        {round}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-[#1E293B]">
                                            <span className="font-bold">{match.home}</span>
                                            <span className="text-gray-300 font-normal">-</span>
                                            <span className="font-bold">{match.away}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-lg text-[#1E4D8C]">
                                        {match.score}
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-500 font-medium text-xs">
                                        {match.date}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-gray-900">
                                        {match.minutes}&apos;
                                    </td>
                                    <td className="px-4 py-4 text-center text-gray-300">-</td>
                                    <td className="px-4 py-4 text-center text-gray-300">-</td>
                                    <td className="px-4 py-4 text-center text-gray-300">-</td>
                                    <td className="px-4 py-4 text-center text-gray-300">-</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination mock */}
                <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 justify-between bg-gray-50/50">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <input type="text" placeholder="10" className="w-12 p-2 text-center text-sm outline-none font-bold text-[#1E4D8C]" />
                        <span className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 border-l border-gray-200 uppercase tracking-wide">әр бетте</span>
                    </div>

                    <div className="flex gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-white hover:border-[#1E4D8C] hover:text-[#1E4D8C] transition-all">←</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1E4D8C] text-white font-bold shadow-md shadow-[#1E4D8C]/20">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 font-bold transition-all border border-transparent hover:border-gray-200">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 font-bold transition-all border border-transparent hover:border-gray-200">3</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 font-bold transition-all border border-transparent hover:border-gray-200">4</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:border-[#1E4D8C] hover:text-[#1E4D8C] transition-all">→</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
