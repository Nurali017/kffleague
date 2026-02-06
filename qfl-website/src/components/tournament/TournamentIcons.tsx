'use client';

import { useTranslation } from 'react-i18next';
import { useTournament } from '@/contexts/TournamentContext';
import { Tournament } from '@/types/tournament';

interface TournamentIconProps {
  tournament: Tournament;
  isActive: boolean;
  onClick: () => void;
}

function TournamentIcon({ tournament, isActive, onClick }: TournamentIconProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'ru' | 'kz';
  const tournamentName = tournament.name[lang] || tournament.name.short || tournament.name.ru;

  return (
    <button
      onClick={onClick}
      className={`
        flex shrink-0 flex-col items-center gap-1 px-3 py-2 md:px-5 md:py-3 transition-all duration-200
        hover:opacity-100 group border-b-[3px]
        ${isActive
          ? 'opacity-100 border-accent-soft'
          : 'opacity-50 hover:opacity-80 border-transparent hover:border-white/30'}
      `}
      title={tournamentName}
      suppressHydrationWarning
    >
      {/* Logo */}
      <div className="w-8 h-8 flex items-center justify-center">
        <img
          src={tournament.logo}
          alt={tournamentName}
          className="w-full h-full object-contain filter brightness-0 invert"
          suppressHydrationWarning
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Tournament name */}
      <span
        className={`text-[10px] font-medium tracking-wide whitespace-nowrap ${
          isActive ? 'text-[#E5B73B]' : 'text-white/80'
        }`}
        suppressHydrationWarning
      >
        {tournament.name.short}
      </span>
    </button>
  );
}

export function TournamentIcons() {
  const { availableTournaments, currentTournament, setTournament } =
    useTournament();

  return (
    <div className="flex min-w-max items-center justify-start gap-0">
      {availableTournaments.map((tournament) => (
        <TournamentIcon
          key={tournament.id}
          tournament={tournament}
          isActive={currentTournament.id === tournament.id}
          onClick={() => setTournament(tournament.id)}
        />
      ))}
    </div>
  );
}
