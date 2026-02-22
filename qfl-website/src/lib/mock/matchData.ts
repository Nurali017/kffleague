import { EnhancedMatchEvent } from '@/types';

export const mockEvents: EnhancedMatchEvent[] = [
  {
    id: 1,
    minute: 12,
    half: 1,
    event_type: 'goal',
    team_id: 1,
    team_name: 'Астана',
    player_id: 1,
    player_name: 'Бакдаулет Алиев',
    player_number: 10,
  },
  {
    id: 2,
    minute: 23,
    half: 1,
    event_type: 'substitution',
    team_id: 1,
    team_name: 'Астана',
    player_id: 2,
    player_name: 'Петров',
    player_number: 7,
    player2_id: 3,
    player2_name: 'Иванов',
    player2_number: 15,
  },
  {
    id: 3,
    minute: 34,
    half: 1,
    event_type: 'yellow_card',
    team_id: 2,
    team_name: 'Кайрат',
    player_id: 4,
    player_name: 'Сергей Козлов',
    player_number: 5,
  },
  {
    id: 4,
    minute: 47, // 45+2'
    half: 1,
    event_type: 'goal',
    team_id: 2,
    team_name: 'Кайрат',
    player_id: 5,
    player_name: 'Дмитрий Жуков',
    player_number: 9,
  },
  {
    id: 5,
    minute: 56,
    half: 2,
    event_type: 'substitution',
    team_id: 2,
    team_name: 'Кайрат',
    player_id: 6,
    player_name: 'Попов',
    player_number: 11,
    player2_id: 7,
    player2_name: 'Смирнов',
    player2_number: 8,
  },
  {
    id: 6,
    minute: 67,
    half: 2,
    event_type: 'goal',
    team_id: 1,
    team_name: 'Астана',
    player_id: 8,
    player_name: 'Максим Антонов',
    player_number: 17,
  },
  {
    id: 7,
    minute: 73,
    half: 2,
    event_type: 'red_card',
    team_id: 2,
    team_name: 'Кайрат',
    player_id: 9,
    player_name: 'Игорь Лебедев',
    player_number: 3,
  },
  // ... existing events
];

export const mockMatchStats = {
  possession: { home: 55, away: 45 },
  shots: { home: 12, away: 8 },
  shots_on_target: { home: 5, away: 3 },
  corners: { home: 6, away: 4 },
  fouls: { home: 10, away: 12 },
  offsides: { home: 2, away: 1 },
  yellow_cards: { home: 2, away: 3 },
  red_cards: { home: 0, away: 1 },
};

export const mockStadium = {
  id: 1,
  name: 'Астана Арена',
  city: 'Астана',
  capacity: 30244,
};

export const mockReferee = 'Александр Иванов';
