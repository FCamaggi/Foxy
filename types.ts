export type AnimalType = 'pig' | 'rooster' | 'zebra' | 'giraffe' | 'octopus' | 'dolphin' | 'bear' | 'rabbit' | 'cat';
export type EnvironmentType = 'farm' | 'savanna' | 'ocean' | 'forest';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type FoxyVariant = 'standard' | 'most-seen' | 'solitary' | 'cat-fox';

export interface CardData {
  id: string;
  isFoxy: boolean;
  environment?: EnvironmentType;
  animals: AnimalType[];
}

export interface Player {
  id: string;
  name: string;
  guesses: (number | null)[];
  bets: boolean[]; // True if they circled the number for this round
  score: number;
  totalScore: number;
}

export type GamePhase = 'LOBBY' | 'PLAYING' | 'SCORING' | 'GAME_OVER';

export interface GameState {
  phase: GamePhase;
  round: number; // 0 to 19
  deck: CardData[];
  players: Player[];
  roomCode: string;
  difficulty: DifficultyLevel;
  foxyVariant: FoxyVariant;
}
