import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoomModel } from './models/Room';
import { generateDeck } from './gameLogic';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST']
  }
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI no está configurada en las variables de entorno');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const generateRoomCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Cleanup inactive rooms every 5 minutes
setInterval(async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  await RoomModel.deleteMany({
    lastActivity: { $lt: fiveMinutesAgo },
    phase: { $in: ['LOBBY', 'PLAYING'] }
  });
}, 5 * 60 * 1000);

io.on('connection', (socket: Socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('createRoom', async (data) => {
    try {
      const { playerName, difficulty, foxyVariant } = data;
      
      let roomCode = generateRoomCode();
      while (await RoomModel.findOne({ code: roomCode })) {
        roomCode = generateRoomCode();
      }

      const room = new RoomModel({
        code: roomCode,
        hostId: socket.id,
        phase: 'LOBBY',
        round: 0,
        deck: [],
        players: [{
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
        }],
        difficulty: difficulty || 'medium',
        foxyVariant: foxyVariant || 'standard',
        createdAt: new Date(),
        lastActivity: new Date()
      });

      await room.save();
      socket.join(roomCode);
      
      console.log(`🎮 Room created: ${roomCode} by ${playerName}`);
      socket.emit('roomCreated', { roomCode, playerId: socket.id });
      socket.emit('gameState', room.toGameState());
      
    } catch (error) {
      console.error('Error creating room:', error);
      socket.emit('error', 'Error al crear sala');
    }
  });

  socket.on('joinRoom', async (data) => {
    try {
      const { roomCode, playerName } = data;
      const room = await RoomModel.findOne({ code: roomCode.toUpperCase() });
      
      if (!room) {
        socket.emit('error', 'Sala no encontrada');
        return;
      }

      if (room.phase !== 'LOBBY') {
        socket.emit('error', 'La partida ya comenzó');
        return;
      }

      if (room.players.length >= 5) {
        socket.emit('error', 'Sala llena');
        return;
      }

      const newPlayer = {
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

      socket.join(roomCode.toUpperCase());
      
      console.log(`👤 ${playerName} joined room ${roomCode}`);
      socket.emit('roomJoined', { roomCode: roomCode.toUpperCase(), playerId: socket.id });
      io.to(roomCode.toUpperCase()).emit('playerJoined', newPlayer);
      io.to(roomCode.toUpperCase()).emit('gameState', room.toGameState());
      
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', 'Error al unirse a la sala');
    }
  });

  socket.on('startGame', async (data) => {
    try {
      const { roomCode } = data;
      const room = await RoomModel.findOne({ code: roomCode });
      
      if (!room || room.hostId !== socket.id) {
        socket.emit('error', 'Solo el host puede iniciar la partida');
        return;
      }

      if (room.players.length < 2) {
        socket.emit('error', 'Se necesitan al menos 2 jugadores');
        return;
      }

      room.deck = generateDeck(room.difficulty);
      room.phase = 'PLAYING';
      room.round = 0;
      room.lastActivity = new Date();
      
      room.players.forEach(p => {
        p.guesses = [];
        p.bets = [];
      });

      await room.save();

      console.log(`🎮 Game started in room ${roomCode}`);
      io.to(roomCode).emit('gameStarted', room.toGameState());
      io.to(roomCode).emit('gameState', room.toGameState());
      
    } catch (error) {
      console.error('Error starting game:', error);
      socket.emit('error', 'Error al iniciar partida');
    }
  });

  socket.on('submitGuess', async (data) => {
    try {
      const { roomCode, playerId, guess, bet } = data;
      const room = await RoomModel.findOne({ code: roomCode });
      
      if (!room) {
        socket.emit('error', 'Sala no encontrada');
        return;
      }

      const player = room.players.find(p => p.id === playerId);
      if (!player) {
        socket.emit('error', 'Jugador no encontrado');
        return;
      }

      // Check if already submitted
      if (player.guesses.length > room.round) {
        return;
      }

      // Validate bet
      if (bet && player.bets.some(b => b)) {
        socket.emit('error', 'Solo puedes apostar una vez por partida');
        return;
      }

      player.guesses.push(guess);
      player.bets.push(bet);
      room.lastActivity = new Date();

      // Check if all players submitted
      const allSubmitted = room.players.every(p => p.guesses.length > room.round);
      
      if (allSubmitted) {
        room.round += 1;
        
        if (room.round >= 20) {
          room.phase = 'SCORING';
          await room.save();
          io.to(roomCode).emit('gameCompleted', room.toGameState());
        } else {
          await room.save();
          io.to(roomCode).emit('roundCompleted', room.toGameState());
        }
      } else {
        await room.save();
      }
      
      io.to(roomCode).emit('gameState', room.toGameState());
      
    } catch (error) {
      console.error('Error submitting guess:', error);
      socket.emit('error', 'Error al enviar respuesta');
    }
  });

  socket.on('disconnect', async () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    
    try {
      const room = await RoomModel.findOne({ 'players.id': socket.id });
      
      if (room) {
        setTimeout(async () => {
          const stillGone = await RoomModel.findOne({ 'players.id': socket.id });
          
          if (stillGone) {
            stillGone.players = stillGone.players.filter(p => p.id !== socket.id);
            
            if (stillGone.players.length === 0) {
              await RoomModel.deleteOne({ code: stillGone.code });
              console.log(`🗑️ Deleted empty room ${stillGone.code}`);
            } else {
              if (stillGone.hostId === socket.id) {
                stillGone.hostId = stillGone.players[0].id;
              }
              
              await stillGone.save();
              io.to(stillGone.code).emit('playerLeft', socket.id);
              io.to(stillGone.code).emit('gameState', stillGone.toGameState());
            }
          }
        }, 30000); // 30 second grace period
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
