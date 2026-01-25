import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoomModel } from './models/Room';
import { generateDeck } from './gameLogic';
import { generateBotGuess } from './utils';
import { 
  ClientToServerEvents, 
  ServerToClientEvents,
  Room,
  Player
} from './types';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configure CORS
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST']
  }
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foxy';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Helper: Generate unique room code
const generateRoomCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Helper: Update room activity
const updateRoomActivity = async (roomCode: string) => {
  await RoomModel.updateOne(
    { code: roomCode },
    { lastActivity: new Date() }
  );
};

// Cleanup inactive rooms every 5 minutes
setInterval(async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const inactiveRooms = await RoomModel.find({
    lastActivity: { $lt: fiveMinutesAgo },
    phase: { $in: ['LOBBY', 'PLAYING'] }
  });

  for (const room of inactiveRooms) {
    // Notify all players
    io.to(room.code).emit('error', 'Sala cerrada por inactividad');
    
    // Delete room
    await RoomModel.deleteOne({ code: room.code });
    console.log(`🧹 Cleaned up inactive room: ${room.code}`);
  }
}, 5 * 60 * 1000);

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // CREATE ROOM
  socket.on('createRoom', async (data) => {
    try {
      const { playerName, difficulty, foxyVariant } = data;
      
      if (!playerName || playerName.trim().length === 0) {
        callback({ success: false, error: 'Nombre de jugador requerido' });
        return;
      }

      // Generate unique room code
      let roomCode = generateRoomCode();
      let existingRoom = await RoomModel.findOne({ code: roomCode });
      
      while (existingRoom) {
        roomCode = generateRoomCode();
        existingRoom = await RoomModel.findOne({ code: roomCode });
      }

      // Create host player
      const hostPlayer: Player = {
        id: socket.id,
        socketId: socket.id,
        name: playerName,
        isBot: false,
        guesses: [],
        bets: [],
        score: 0,
        totalScore: 0,
        isReady: false,
        lastActivity: new Date()
      };

      // Create room
      const room = new RoomModel({
        code: roomCode,
        hostId: socket.id,
        phase: 'LOBBY',
        round: 0,
        deck: [],
        players: [hostPlayer],
        difficulty: difficulty || 'medium',
        foxyVariant: foxyVariant || 'standard',
        createdAt: new Date(),
        lastActivity: new Date(),
        maxPlayers: 5
      });

      await room.save();
      
      // Join socket room
      socket.join(roomCode);
      
      console.log(`🎮 Room created: ${roomCode} by ${playerName}`);
      callback({ success: true, roomCode });
      
      // Broadcast room update
      io.to(roomCode).emit('room-updated', room.toObject());
      
    } catch (error) {
      console.error('Error creating room:', error);
      callback({ success: false, error: 'Error al crear sala' });
    }
  });

  // JOIN ROOM
  socket.on('join-room', async (data, callback) => {
    try {
      const { roomCode, playerName } = data;
      
      if (!playerName || playerName.trim().length === 0) {
        callback({ success: false, error: 'Nombre de jugador requerido' });
        return;
      }

      const room = await RoomModel.findOne({ code: roomCode.toUpperCase() });
      
      if (!room) {
        callback({ success: false, error: 'Sala no encontrada' });
        return;
      }

      if (room.phase !== 'LOBBY') {
        callback({ success: false, error: 'La partida ya comenzó' });
        return;
      }

      if (room.players.length >= room.maxPlayers) {
        callback({ success: false, error: 'Sala llena' });
        return;
      }

      // Check if player already exists
      const existingPlayer = room.players.find(p => p.socketId === socket.id);
      if (existingPlayer) {
        callback({ success: false, error: 'Ya estás en esta sala' });
        return;
      }

      // Create new player
      const newPlayer: Player = {
        id: socket.id,
        socketId: socket.id,
        name: playerName,
        isBot: false,
        guesses: [],
        bets: [],
        score: 0,
        totalScore: 0,
        isReady: false,
        lastActivity: new Date()
      };

      room.players.push(newPlayer);
      room.lastActivity = new Date();
      await room.save();

      // Join socket room
      socket.join(roomCode);
      
      console.log(`👤 ${playerName} joined room ${roomCode}`);
      callback({ success: true, room: room.toObject() });
      
      // Notify others
      socket.to(roomCode).emit('player-joined', newPlayer);
      io.to(roomCode).emit('room-updated', room.toObject());
      
    } catch (error) {
      console.error('Error joining room:', error);
      callback({ success: false, error: 'Error al unirse a la sala' });
    }
  });

  // PLAYER READY
  socket.on('player-ready', async (callback) => {
    try {
      const room = await RoomModel.findOne({ 'players.socketId': socket.id });
      
      if (!room) {
        callback({ success: false, error: 'No estás en ninguna sala' });
        return;
      }

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) {
        callback({ success: false, error: 'Jugador no encontrado' });
        return;
      }

      player.isReady = true;
      player.lastActivity = new Date();
      room.lastActivity = new Date();
      await room.save();

      callback({ success: true });
      io.to(room.code).emit('room-updated', room.toObject());
      
    } catch (error) {
      console.error('Error marking player ready:', error);
      callback({ success: false, error: 'Error al marcar listo' });
    }
  });

  // START GAME
  socket.on('start-game', async (callback) => {
    try {
      const room = await RoomModel.findOne({ hostId: socket.id });
      
      if (!room) {
        callback({ success: false, error: 'Solo el host puede iniciar la partida' });
        return;
      }

      if (room.phase !== 'LOBBY') {
        callback({ success: false, error: 'La partida ya comenzó' });
        return;
      }

      const allReady = room.players.every(p => p.isReady || p.socketId === socket.id);
      if (!allReady && room.players.length > 1) {
        callback({ success: false, error: 'No todos los jugadores están listos' });
        return;
      }

      // Generate deck
      room.deck = generateDeck(room.difficulty);
      room.phase = 'PLAYING';
      room.round = 0;
      room.lastActivity = new Date();
      
      // Reset player states
      room.players.forEach(p => {
        p.guesses = [];
        p.bets = [];
        p.score = 0;
        p.totalScore = 0;
        p.isReady = false;
      });

      await room.save();

      console.log(`🎮 Game started in room ${room.code}`);
      callback({ success: true });
      io.to(room.code).emit('game-started', room.toObject());
      
    } catch (error) {
      console.error('Error starting game:', error);
      callback({ success: false, error: 'Error al iniciar partida' });
    }
  });

  // SUBMIT GUESS
  socket.on('submit-guess', async (data, callback) => {
    try {
      const { guess, bet } = data;
      const room = await RoomModel.findOne({ 'players.socketId': socket.id });
      
      if (!room) {
        callback({ success: false, error: 'No estás en ninguna sala' });
        return;
      }

      if (room.phase !== 'PLAYING') {
        callback({ success: false, error: 'La partida no está en curso' });
        return;
      }

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) {
        callback({ success: false, error: 'Jugador no encontrado' });
        return;
      }

      // Check if already submitted for this round
      if (player.guesses.length > room.round) {
        callback({ success: false, error: 'Ya enviaste tu respuesta' });
        return;
      }

      // Validate bet (only one per game)
      if (bet && player.bets.some(b => b)) {
        callback({ success: false, error: 'Solo puedes apostar una vez por partida' });
        return;
      }

      // Save guess
      player.guesses.push(guess);
      player.bets.push(bet);
      player.lastActivity = new Date();
      room.lastActivity = new Date();

      // Check if all players submitted
      const allSubmitted = room.players.every(p => p.guesses.length > room.round);
      
      if (allSubmitted) {
        // Move to next round
        room.round += 1;
        
        if (room.round >= 20) {
          // Game over
          room.phase = 'SCORING';
          await room.save();
          
          callback({ success: true });
          io.to(room.code).emit('game-over', room.toObject());
        } else {
          // Next round
          await room.save();
          callback({ success: true });
          io.to(room.code).emit('round-complete', room.toObject());
        }
      } else {
        await room.save();
        callback({ success: true });
        io.to(room.code).emit('room-updated', room.toObject());
      }
      
    } catch (error) {
      console.error('Error submitting guess:', error);
      callback({ success: false, error: 'Error al enviar respuesta' });
    }
  });

  // RESTART GAME
  socket.on('restart-game', async (callback) => {
    try {
      const room = await RoomModel.findOne({ hostId: socket.id });
      
      if (!room) {
        callback({ success: false, error: 'Solo el host puede reiniciar la partida' });
        return;
      }

      room.phase = 'LOBBY';
      room.round = 0;
      room.deck = [];
      room.lastActivity = new Date();
      
      room.players.forEach(p => {
        p.guesses = [];
        p.bets = [];
        p.score = 0;
        p.totalScore = 0;
        p.isReady = false;
      });

      await room.save();

      callback({ success: true });
      io.to(room.code).emit('room-updated', room.toObject());
      
    } catch (error) {
      console.error('Error restarting game:', error);
      callback({ success: false, error: 'Error al reiniciar partida' });
    }
  });

  // LEAVE ROOM
  socket.on('leave-room', async () => {
    try {
      const room = await RoomModel.findOne({ 'players.socketId': socket.id });
      
      if (room) {
        // Remove player
        room.players = room.players.filter(p => p.socketId !== socket.id);
        
        if (room.players.length === 0) {
          // Delete empty room
          await RoomModel.deleteOne({ code: room.code });
          console.log(`🗑️ Deleted empty room ${room.code}`);
        } else {
          // Transfer host if needed
          if (room.hostId === socket.id) {
            room.hostId = room.players[0].socketId;
          }
          
          room.lastActivity = new Date();
          await room.save();
          
          socket.to(room.code).emit('player-left', socket.id);
          io.to(room.code).emit('room-updated', room.toObject());
        }
        
        socket.leave(room.code);
      }
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  });

  // PING/PONG for keeping connection alive
  socket.on('ping', () => {
    socket.emit('pong');
    updateRoomActivity(socket.id);
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    
    try {
      const room = await RoomModel.findOne({ 'players.socketId': socket.id });
      
      if (room) {
        // Remove player after grace period (30 seconds)
        setTimeout(async () => {
          const stillGone = await RoomModel.findOne({ 
            'players.socketId': socket.id 
          });
          
          if (stillGone) {
            stillGone.players = stillGone.players.filter(p => p.socketId !== socket.id);
            
            if (stillGone.players.length === 0) {
              await RoomModel.deleteOne({ code: stillGone.code });
              console.log(`🗑️ Deleted empty room ${stillGone.code}`);
            } else {
              if (stillGone.hostId === socket.id) {
                stillGone.hostId = stillGone.players[0].socketId;
              }
              
              await stillGone.save();
              io.to(stillGone.code).emit('player-left', socket.id);
              io.to(stillGone.code).emit('room-updated', stillGone.toObject());
            }
          }
        }, 30000);
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready`);
});
