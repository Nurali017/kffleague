'use client';

import { createContext, ReactNode, useContext, useMemo } from 'react';

export type RoutePrefetchMap = Record<string, unknown>;

const RoutePrefetchContext = createContext<RoutePrefetchMap>({});

interface RoutePrefetchProviderProps {
  children: ReactNode;
  value?: RoutePrefetchMap;
}

export function RoutePrefetchProvider({
  children,
  value,
}: RoutePrefetchProviderProps) {
  const memoizedValue = useMemo(() => value || {}, [value]);
  return (
    <RoutePrefetchContext.Provider value={memoizedValue}>
      {children}
    </RoutePrefetchContext.Provider>
  );
}

export function useRoutePrefetchValue<T>(key: string | null): T | undefined {
  const map = useContext(RoutePrefetchContext);
  if (!key) return undefined;
  return map[key] as T | undefined;
}
