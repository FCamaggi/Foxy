import React, { useState, useEffect } from 'react';
import { GameState, Player, DifficultyLevel, FoxyVariant } from './types';
import { ANIMAL_CONFIG } from './constants';
import { CardDisplay } from './components/CardDisplay';
import { PlayerInput } from './components/PlayerInput';
import { ScoringTable } from './components/ScoringTable';
import { ManualModal } from './components/ManualModal';
import { Play, Users, Gamepad2, Volume2, VolumeX, Book, ChevronDown, ChevronUp, Wifi, WifiOff } from 'lucide-react';
import { getSocket, disconnectSocket } from './socket';

const App: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [selectedVariant, setSelectedVariant] = useState<FoxyVariant>('standard');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  
  const [gameState, setGameState] = useState<GameState>({
    phase: 'LOBBY',
    round: 0,
    deck: [],
    players: [],
    roomCode: '',
    difficulty: 'medium',
    foxyVariant: 'standard',
  });

  // Initialize socket connection
  useEffect(() => {
    const socket = getSocket();
    
    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('error', (message: string) => {
      setError(message);
    });

    socket.on('roomCreated', (data: { roomCode: string; playerId: string }) => {
      setCurrentPlayerId(data.playerId);
      setGameState(prev => ({
        ...prev,
        roomCode: data.roomCode,
        phase: 'LOBBY'
      }));
    });

    socket.on('roomJoined', (data: { roomCode: string; playerId: string }) => {
      setCurrentPlayerId(data.playerId);
      setGameState(prev => ({
        ...prev,
        roomCode: data.roomCode
      }));
    });

    socket.on('gameState', (newState: GameState) => {
      setGameState(newState);
    });

    socket.on('playerJoined', (player: Player) => {
      playSound('click');
    });

    socket.on('playerLeft', (playerId: string) => {
      // Handle player leaving
    });

    socket.on('gameStarted', (newState: GameState) => {
      setGameState(newState);
      playSound('click');
    });

    socket.on('roundCompleted', (newState: GameState) => {
      setGameState(newState);
      playSound('flip');
    });

    socket.on('gameCompleted', (newState: GameState) => {
      setGameState(newState);
      playSound('win');
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  // Sound effect helper (mock)
  const playSound = (type: 'flip' | 'win' | 'click') => {
    if (!soundEnabled) return;
    // Real implementation would use Audio objects here
  };

  const handleCreateGame = () => {
    if (!playerName) return;
    const socket = getSocket();
    socket.emit('createRoom', {
      playerName,
      difficulty: selectedDifficulty,
      foxyVariant: selectedVariant
    });
    playSound('click');
  };

  const handleJoinGame = () => {
    if (!playerName || !inputCode) return;
    const socket = getSocket();
    socket.emit('joinRoom', {
      roomCode: inputCode.toUpperCase(),
      playerName
    });
    playSound('click');
  };

  const handlePlayerSubmit = (guess: number, bet: boolean) => {
    if (!currentPlayerId) return;
    
    const socket = getSocket();
    socket.emit('submitGuess', {
      roomCode: gameState.roomCode,
      playerId: currentPlayerId,
      guess,
      bet
    });
    playSound('flip');
  };

  const handleStartGame = () => {
    const socket = getSocket();
    socket.emit('startGame', { roomCode: gameState.roomCode });
  };

  const restartGame = () => {
    setGameState(prev => ({
      phase: 'LOBBY',
      round: 0,
      deck: [],
      players: [],
      roomCode: '',
      difficulty: 'medium',
      foxyVariant: 'standard',
    }));
    setCurrentPlayerId(null);
    setInputCode('');
  };

  // Render Lobby
  if (gameState.phase === 'LOBBY') {
    // If already in a room, show waiting room
    if (gameState.roomCode && gameState.players.length > 0) {
      return (
        <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-4">
          <ManualModal isOpen={showManual} onClose={() => setShowManual(false)} />
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="absolute top-4 right-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                <span className="text-xs font-medium">{isConnected ? 'Conectado' : 'Desconectado'}</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-4xl">🦊</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Sala de Espera</h1>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full inline-block font-mono font-bold text-xl shadow-lg">
                {gameState.roomCode}
              </div>
              <p className="text-sm text-gray-500 mt-2">Comparte este código con tus amigos</p>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Jugadores ({gameState.players.length}/5)</h3>
              {gameState.players.map(player => (
                <div key={player.id} className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800">{player.name}</span>
                  {player.id === currentPlayerId && (
                    <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">Tú</span>
                  )}
                </div>
              ))}
              {Array.from({ length: Math.max(0, 2 - gameState.players.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg opacity-50">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-400 italic">Esperando jugador...</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg mb-4">
              <div className="flex justify-between">
                <span>Dificultad:</span>
                <span className="font-bold">{gameState.difficulty === 'easy' ? 'Fácil' : gameState.difficulty === 'medium' ? 'Medio' : 'Difícil'}</span>
              </div>
              <div className="flex justify-between">
                <span>Variante:</span>
                <span className="font-bold">
                  {gameState.foxyVariant === 'standard' ? 'Estándar' : 
                   gameState.foxyVariant === 'most-seen' ? 'Animal más visto' :
                   gameState.foxyVariant === 'solitary' ? 'Solitarios' : 'Zorro Gatuno'}
                </span>
              </div>
            </div>

            {gameState.players.length >= 2 && gameState.players[0].id === currentPlayerId && (
              <button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Play size={20} /> ¡Comenzar Partida!
              </button>
            )}

            {gameState.players[0].id !== currentPlayerId && (
              <div className="text-center text-sm text-gray-500 py-3">
                Esperando a que el anfitrión inicie la partida...
              </div>
            )}

            <button
              onClick={restartGame}
              className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition-colors text-sm"
            >
              Salir de la Sala
            </button>
          </div>
        </div>
      );
    }

    // Show initial lobby
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-4">
        <ManualModal isOpen={showManual} onClose={() => setShowManual(false)} />
        
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            </div>
            <button 
              onClick={() => setShowManual(true)}
              className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-indigo-50"
              title="Ver Manual"
            >
              <Book size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
             <span className="text-4xl">🦊</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Foxy Digital</h1>
          <p className="text-gray-500 mb-8">¡Pon a prueba tu memoria y observación!</p>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />

            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Dificultad</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                      selectedDifficulty === diff 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {diff === 'easy' ? 'Fácil' : diff === 'medium' ? 'Medio' : 'Difícil'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 italic">
                {selectedDifficulty === 'easy' && '70% cartas simples, 25% dobles, 5% triples'}
                {selectedDifficulty === 'medium' && '50% cartas simples, 30% dobles, 20% triples'}
                {selectedDifficulty === 'hard' && '40% cartas simples, 35% dobles, 25% triples'}
              </p>
            </div>

            {/* Foxy Variant Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Variante de Foxy</label>
              <select 
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value as FoxyVariant)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
              >
                <option value="standard">🦊 Estándar (Tipos únicos)</option>
                <option value="most-seen">📊 Animal más visto</option>
                <option value="solitary">🎯 Animales solitarios</option>
                <option value="cat-fox">🐱 Zorro Gatuno</option>
              </select>
              <p className="text-xs text-gray-500 italic">
                {selectedVariant === 'standard' && 'Cuenta cuántos tipos de animales diferentes has visto'}
                {selectedVariant === 'most-seen' && 'Cuenta las veces del animal más repetido'}
                {selectedVariant === 'solitary' && 'Cuenta cuántas cartas tenían solo un animal'}
                {selectedVariant === 'cat-fox' && 'El zorro cuenta como un gato más'}
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Crear Sala</span>
              </div>
            </div>

            <button
              onClick={handleCreateGame}
              disabled={!playerName}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Play size={20} /> Crear Partida Nueva
            </button>
            
            <button 
               onClick={() => setShowManual(true)}
               className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Book size={16} /> ¿Cómo Jugar?
            </button>

            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O Unirse</span>
              </div>
            </div>
            
            <div className="flex gap-2">
               <input
                type="text"
                placeholder="CÓDIGO"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none uppercase"
              />
              <button
                onClick={handleJoinGame}
                disabled={!playerName || !inputCode}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Game Board
  if (gameState.phase === 'PLAYING') {
    const currentCard = gameState.deck[gameState.round];
    
    // Generar texto descriptivo según la variante
    let hintText = '';
    
    if (currentCard.isFoxy) {
      switch (gameState.foxyVariant) {
        case 'standard':
          hintText = "¡Cuenta TIPOS de animales distintos totales!";
          break;
        case 'most-seen':
          hintText = "¡Cuenta las veces del animal MÁS REPETIDO!";
          break;
        case 'solitary':
          hintText = "¡Cuenta cuántas cartas han tenido SOLO UN animal!";
          break;
        case 'cat-fox':
          hintText = "¡Cuenta TODOS los gatos (Foxy cuenta como 1)!";
          break;
      }
    } else {
      const animalsText = currentCard.animals.map(a => ANIMAL_CONFIG[a].label + 's').join(' y ');
      
      if (gameState.foxyVariant === 'cat-fox' && currentCard.animals.includes('cat')) {
        hintText = `¡Cuenta TODOS los ${animalsText} totales (incluye Foxys)!`;
      } else {
        hintText = `¡Cuenta TODOS los ${animalsText} totales!`;
      }
    }

    return (
      <div className="h-[100dvh] bg-slate-100 flex flex-col overflow-hidden">
        {/* Header Compact */}
        <header className="w-full bg-white shadow-sm p-2 sm:p-4 flex justify-between items-center shrink-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">F</div>
            <h1 className="font-bold text-gray-800 text-sm sm:text-lg hidden xs:block">Foxy</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 bg-gray-100 px-3 py-1 rounded-full">
            <Gamepad2 className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-mono font-bold text-indigo-600 text-sm sm:text-base">Ronda {gameState.round + 1}/20</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
              <Users size={12} /> <span className="hidden sm:inline">Código:</span> {gameState.roomCode}
            </div>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
               {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </header>

        {/* Main Game Area */}
        <main className="flex-1 flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 gap-4">
          
          <div className="flex flex-col items-center w-full max-w-md gap-4">
            
            {/* Card Area - Centered and Visible */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative">
                <CardDisplay card={currentCard} revealed={true} />
              </div>
              <div className="text-center mt-2 max-w-[280px]">
                <p className="text-xs sm:text-sm text-gray-500 italic leading-tight">
                  {hintText}
                </p>
              </div>
            </div>

            {/* Input Area - Close to card */}
            <PlayerInput 
              player={gameState.players.find(p => p.id === currentPlayerId)!}
              onSubmit={handlePlayerSubmit}
              round={gameState.round}
            />

            {/* Other Players Status (Collapsible on mobile) */}
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden shrink-0">
              <button 
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                 <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Estado de Jugadores</span>
                 {isStatusOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              
              <div className={`px-4 transition-all duration-300 ${isStatusOpen ? 'max-h-60 py-2' : 'max-h-0 py-0 overflow-hidden'}`}>
                <div className="space-y-2">
                  {gameState.players.map(p => (
                    <div key={p.id} className="flex justify-between items-center border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.id === currentPlayerId ? 'bg-indigo-500' : 'bg-green-500'}`}></div>
                        <span className={`text-sm font-medium ${p.id === currentPlayerId ? 'text-indigo-900' : 'text-gray-600'}`}>
                          {p.name} {p.id === currentPlayerId && '(Tú)'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {p.guesses[gameState.round] !== null && p.guesses[gameState.round] !== undefined ? '✓ Enviado' : 'Escribiendo...'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // Render Scoring
  if (gameState.phase === 'SCORING') {
    return (
      <div className="h-[100dvh] bg-slate-100 flex flex-col items-center p-2 sm:p-4 overflow-hidden">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-900 my-2 sm:my-4 shrink-0">¡Juego Terminado!</h1>
        <ScoringTable gameState={gameState} onRestart={restartGame} />
      </div>
    );
  }

  return <div>Cargando...</div>;
};

export default App;