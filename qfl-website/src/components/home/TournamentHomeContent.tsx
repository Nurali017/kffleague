import { CupOverviewResponse, CupScheduleResponse, GroupedMatchesResponse, TeamStanding } from '@/types';
import { CupHome } from './CupHome';
import { SecondLeagueHome } from './SecondLeagueHome';

export interface SecondLeagueHomeData {
  groupAStandings?: TeamStanding[] | null;
  groupBStandings?: TeamStanding[] | null;
  groupAMatches?: GroupedMatchesResponse | null;
  groupBMatches?: GroupedMatchesResponse | null;
  finalMatches?: GroupedMatchesResponse | null;
}

export interface CupHomeData {
  overview?: CupOverviewResponse | null;
  schedule?: CupScheduleResponse | null;
}

interface TournamentHomeContentProps {
  tournamentId: string;
  secondLeagueData?: SecondLeagueHomeData | null;
  cupData?: CupHomeData | null;
}

export function TournamentHomeContent({
  tournamentId,
  secondLeagueData,
  cupData,
}: TournamentHomeContentProps) {
  if (tournamentId === '2l') {
    return (
      <SecondLeagueHome
        groupAStandings={secondLeagueData?.groupAStandings}
        groupBStandings={secondLeagueData?.groupBStandings}
        groupAMatches={secondLeagueData?.groupAMatches}
        groupBMatches={secondLeagueData?.groupBMatches}
        finalMatches={secondLeagueData?.finalMatches}
      />
    );
  }

  if (tournamentId === 'cup') {
    return <CupHome overview={cupData?.overview} schedule={cupData?.schedule} />;
  }

  return null;
}
