import mongoose, { Schema, Document } from 'mongoose';
import { Room, Player, CardData, GamePhase, DifficultyLevel, FoxyVariant } from './types';

interface RoomDocument extends Omit<Room, 'code'>, Document {
  code: string;
}

const PlayerSchema = new Schema<Player>({
  id: { type: String, required: true },
  socketId: { type: String, required: true },
  name: { type: String, required: true },
  isBot: { type: Boolean, default: false },
  guesses: [{ type: Number, default: null }],
  bets: [{ type: Boolean, default: false }],
  score: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  isReady: { type: Boolean, default: false },
  lastActivity: { type: Date, default: Date.now }
});

const CardSchema = new Schema<CardData>({
  id: { type: String, required: true },
  isFoxy: { type: Boolean, required: true },
  environment: { type: String },
  animals: [{ type: String }]
});

const RoomSchema = new Schema<RoomDocument>({
  code: { type: String, required: true, unique: true, index: true },
  hostId: { type: String, required: true },
  phase: { type: String, required: true, default: 'LOBBY' },
  round: { type: Number, default: 0 },
  deck: [CardSchema],
  players: [PlayerSchema],
  difficulty: { type: String, required: true, default: 'medium' },
  foxyVariant: { type: String, required: true, default: 'standard' },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  maxPlayers: { type: Number, default: 5 }
});

// Index for cleaning old rooms
RoomSchema.index({ lastActivity: 1 });

// Auto-delete rooms after 24 hours of inactivity
RoomSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 86400 });

// Method to convert to client GameState
RoomSchema.methods.toGameState = function() {
  return {
    phase: this.phase,
    round: this.round,
    deck: this.deck,
    players: this.players.map(p => ({
      id: p.id,
      name: p.name,
      guesses: p.guesses,
      bets: p.bets,
      score: p.score,
      totalScore: p.totalScore
    })),
    roomCode: this.code,
    difficulty: this.difficulty,
    foxyVariant: this.foxyVariant
  };
};

export const RoomModel = mongoose.model<RoomDocument>('Room', RoomSchema);
