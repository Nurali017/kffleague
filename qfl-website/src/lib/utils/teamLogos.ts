// Team logo mapping by team_id
// Add real logo URLs here when available

const TEAM_LOGOS: Record<number, string> = {
  // Premier League teams
  13: 'https://upload.wikimedia.org/wikipedia/en/5/5c/FC_Kairat_logo.png', // Kairat
  91: 'https://upload.wikimedia.org/wikipedia/en/d/df/FC_Astana_logo.png', // Astana
  90: 'https://upload.wikimedia.org/wikipedia/en/8/82/FC_Tobol_logo.png', // Tobol
  93: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/FK_Elimai_logo.png', // Elimai
  51: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Aktobe_logo.png', // Aktobe
  92: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/FC_Zhenis_Astana_logo.png', // Jenis
  81: 'https://upload.wikimedia.org/wikipedia/en/2/22/FC_Ordabasy_logo.png', // Ordabasy
  318: 'https://upload.wikimedia.org/wikipedia/en/b/b7/Okzhetpes_logo.png', // Okzhetpes
  87: 'https://upload.wikimedia.org/wikipedia/en/2/29/FC_Kyzylzhar_logo.png', // Kyzylzhar
  293: 'https://upload.wikimedia.org/wikipedia/commons/9/94/FC_Ulytau_logo.png', // Ulytau
  94: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Kaysar_FK_logo.png', // Kaysar
  45: 'https://upload.wikimedia.org/wikipedia/en/0/0f/FC_Zhetysu_logo.png', // Jetisu
  49: 'https://upload.wikimedia.org/wikipedia/en/5/59/FC_Atyrau_logo.png', // Atyrau
  80: 'https://upload.wikimedia.org/wikipedia/en/9/97/FC_Turan_logo.png', // Turan
  46: 'https://upload.wikimedia.org/wikipedia/en/4/4e/FC_Shakhter_Karagandy_logo.png', // Shakhter
};

// Neutral color constants — no per-team colors
export const HOME_COLOR = '#1E4D8C';    // синий — хозяева
export const AWAY_COLOR = '#E5B73B';    // золотой — гости
export const NEUTRAL_COLOR = '#6B7280'; // серый — таблицы/лидерборды

export function getTeamLogo(teamId: number): string | null {
  return TEAM_LOGOS[teamId] || null;
}

// Returns a neutral fallback color for logo circles in tables/leaderboards
export function getTeamColor(_teamId: number): string {
  return NEUTRAL_COLOR;
}

export function getTeamInitials(teamName: string): string {
  return teamName.slice(0, 3).toUpperCase();
}
