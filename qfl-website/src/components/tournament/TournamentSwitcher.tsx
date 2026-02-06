'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTournament } from '@/contexts/TournamentContext';
import { TournamentSwitcherView } from './TournamentSwitcherView';

export function TournamentSwitcher() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';

  const { availableTournaments, currentTournament, setTournament } = useTournament();
  const [open, setOpen] = useState(false);

  if (availableTournaments.length <= 1) return null;

  return (
    <TournamentSwitcherView
      tournaments={availableTournaments}
      currentId={currentTournament.id}
      lang={lang}
      open={open}
      onOpenChange={setOpen}
      onSelect={(id) => setTournament(id)}
    />
  );
}

