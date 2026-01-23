import { useTranslation } from 'react-i18next';
import { Instagram, Globe } from 'lucide-react';
import Link from 'next/link';

interface TeamPageHeroProps {
    team: any;
}

export function TeamPageHero({ team }: TeamPageHeroProps) {
    const { t } = useTranslation();

    return (
        <div className="relative w-full bg-gradient-to-r from-[#0055D4] to-[#0099FF] pt-24 pb-12 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-1/2" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Logo */}
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-4 flex items-center justify-center shadow-lg border-4 border-white shrink-0">
                    {team.logo_url && (
                        <img src={team.logo_url} alt={team.name} className="w-full h-full object-contain" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left text-white pt-2">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2 block">
                        Freedom QJ League
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-1">
                        {team.name}
                    </h1>
                    <p className="text-xl opacity-90 font-medium mb-6">
                        {team.stadium?.city || 'Kazakhstan'}
                    </p>

                    {/* Socials / Links */}
                    <div className="flex items-center justify-center md:justify-start gap-6">
                        {team.socials?.website && (
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase opacity-60 font-bold">Club Website</span>
                                <Link href={`https://${team.socials.website}`} className="font-bold hover:underline flex items-center gap-1">
                                    {team.socials.website} <Globe className="w-3 h-3" />
                                </Link>
                            </div>
                        )}
                        {team.socials?.instagram && (
                            <Link href={team.socials.instagram} className="hover:opacity-80 transition-opacity">
                                <Instagram className="w-6 h-6" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
