export interface Card {
  id: string;
  name: string;
  description: string;
  cost: number;
  attack: number;
  health: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'creature' | 'spell' | 'artifact';
  abilities?: string[];
  imageUrl?: string;
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  isActive: boolean;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  totalDamageDealt: number;
  favoriteCard: string | null;
}

export interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  coins: number;
  gems: number;
  cards: Card[];
  decks: Deck[];
  stats: PlayerStats;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface Tutorial {
  completed: boolean;
  currentStep: number;
}

export interface GameState {
  player: Player;
  settings: GameSettings;
  tutorial: Tutorial;
}

export interface BattlePlayer extends Player {
  currentDeck: Deck;
  health: number;
  energy: number;
  hand: Card[];
}

export interface BattleState {
  player: BattlePlayer;
  opponent: BattlePlayer;
  turn: 'player' | 'opponent';
  turnCount: number;
  battleLog: string[];
  gameOver: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  wins: number;
  rank: number;
}