export type AnimalType = 'pig' | 'rooster' | 'zebra' | 'giraffe' | 'octopus' | 'dolphin' | 'bear' | 'rabbit' | 'cat';
export type EnvironmentType = 'farm' | 'savanna' | 'ocean' | 'forest';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type FoxyVariant = 'standard' | 'most-seen' | 'solitary' | 'cat-fox';
export type GamePhase = 'LOBBY' | 'PLAYING' | 'SCORING' | 'GAME_OVER';

export interface CardData {
  id: string;
  isFoxy: boolean;
  environment?: EnvironmentType;
  animals: AnimalType[];
}

export interface Player {
  id: string;
  socketId: string;
  name: string;
  isBot: boolean;
  guesses: (number | null)[];
  bets: boolean[];
  score: number;
  totalScore: number;
  isReady: boolean;
  lastActivity: Date;
}

export interface Room {
  code: string;
  hostId: string;
  phase: GamePhase;
  round: number;
  deck: CardData[];
  players: Player[];
  difficulty: DifficultyLevel;
  foxyVariant: FoxyVariant;
  createdAt: Date;
  lastActivity: Date;
  maxPlayers: number;
}

export interface ClientToServerEvents {
  'create-room': (data: { playerName: string; difficulty: DifficultyLevel; foxyVariant: FoxyVariant }, callback: (response: { success: boolean; roomCode?: string; error?: string }) => void) => void;
  'join-room': (data: { roomCode: string; playerName: string }, callback: (response: { success: boolean; room?: Room; error?: string }) => void) => void;
  'player-ready': (callback: (response: { success: boolean; error?: string }) => void) => void;
  'start-game': (callback: (response: { success: boolean; error?: string }) => void) => void;
  'submit-guess': (data: { guess: number; bet: boolean }, callback: (response: { success: boolean; error?: string }) => void) => void;
  'restart-game': (callback: (response: { success: boolean; error?: string }) => void) => void;
  'leave-room': () => void;
  'ping': () => void;
}

export interface ServerToClientEvents {
  'room-updated': (room: Room) => void;
  'game-started': (room: Room) => void;
  'round-complete': (room: Room) => void;
  'game-over': (room: Room) => void;
  'player-joined': (player: Player) => void;
  'player-left': (playerId: string) => void;
  'error': (message: string) => void;
  'pong': () => void;
}
