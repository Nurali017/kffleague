'use client';

import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type ComponentProps, useMemo } from 'react';
import { withTournamentContext } from '@/lib/utils/entityRoutes';

type TournamentAwareLinkProps = ComponentProps<typeof NextLink>;

export function TournamentAwareLink({ href, ...props }: TournamentAwareLinkProps) {
  const searchParams = useSearchParams();

  const hrefWithTournamentContext = useMemo(
    () => withTournamentContext(href, searchParams),
    [href, searchParams]
  );

  return <NextLink href={hrefWithTournamentContext} {...props} />;
}
