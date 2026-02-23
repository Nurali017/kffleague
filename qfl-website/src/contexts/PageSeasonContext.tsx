'use client';

import { createContext, useContext, ReactNode } from 'react';

interface PageSeasonContextValue {
  seasonId: number;
}

const PageSeasonContext = createContext<PageSeasonContextValue | null>(null);

interface PageSeasonProviderProps {
  children: ReactNode;
  seasonId: number;
}

export function PageSeasonProvider({ children, seasonId }: PageSeasonProviderProps) {
  return (
    <PageSeasonContext.Provider value={{ seasonId }}>
      {children}
    </PageSeasonContext.Provider>
  );
}

export function usePageSeason(): number {
  const ctx = useContext(PageSeasonContext);
  if (!ctx) {
    throw new Error('usePageSeason must be used within PageSeasonProvider');
  }
  return ctx.seasonId;
}
