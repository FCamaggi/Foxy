import React, { useState, useEffect } from 'react';
import { GameState, Player } from '../types';
import { calculateCorrectAnswer } from '../gameUtils';
import { Circle, Trophy, Medal, Award } from 'lucide-react';
import { ENV_CONFIG } from '../constants';

interface ScoringTableProps {
  gameState: GameState;
  onRestart: () => void;
}

interface PlayerStats {
  player: Player;
  totalScore: number;
  betScore: number;
  failCount: number;
  rank: number;
}

export const ScoringTable: React.FC<ScoringTableProps> = ({ gameState, onRestart }) => {
  const [revealedIndex, setRevealedIndex] = useState(-1);

  // Auto-reveal rows for dramatic effect
  useEffect(() => {
    if (revealedIndex < 20) {
      const timer = setTimeout(() => {
        setRevealedIndex(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [revealedIndex]);

  const calculateRoundScore = (guess: number | null, actual: number, bet: boolean) => {
    if (guess === null) return 0;
    
    if (bet) {
      return guess === actual ? guess * 2 : 0;
    }
    return guess <= actual ? guess : 0;
  };

  const calculatePlayerStats = (playerIndex: number, currentRevealIndex: number): PlayerStats => {
    let totalScore = 0;
    let betScore = 0;
    let failCount = 0;
    
    for (let r = 0; r < Math.min(gameState.round + 1, currentRevealIndex); r++) {
      const actual = calculateCorrectAnswer(r, gameState.deck, gameState.foxyVariant);
      const guess = gameState.players[playerIndex].guesses[r];
      const bet = gameState.players[playerIndex].bets[r];
      const score = calculateRoundScore(guess, actual, bet);
      
      totalScore += score;
      if (bet && score > 0) {
        betScore += score;
      }
      if (score === 0 && guess !== null) {
        failCount++;
      }
    }
    
    return {
      player: gameState.players[playerIndex],
      totalScore,
      betScore,
      failCount,
      rank: 0 // Will be calculated later
    };
  };

  const calculateTotalScore = (playerIndex: number, currentRevealIndex: number) => {
    return calculatePlayerStats(playerIndex, currentRevealIndex).totalScore;
  };

  // Calculate rankings with tiebreaker
  const getRankedPlayers = (): PlayerStats[] => {
    const stats = gameState.players.map((_, idx) => 
      calculatePlayerStats(idx, revealedIndex)
    );
    
    // Sort by: 1) Total score DESC, 2) Bet score DESC, 3) Fail count ASC
    stats.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.betScore !== a.betScore) return b.betScore - a.betScore;
      return a.failCount - b.failCount;
    });
    
    // Assign ranks
    stats.forEach((stat, idx) => {
      stat.rank = idx + 1;
    });
    
    return stats;
  };

  const rankedPlayers = revealedIndex >= 20 ? getRankedPlayers() : [];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden my-4 sm:my-8 h-full">
      <div className="bg-indigo-900 w-full p-4 sm:p-6 text-center shrink-0">
        <h2 className="text-xl sm:text-3xl font-bold text-white">Tabla de Puntuación</h2>
        <p className="text-indigo-200 text-sm mt-1">
          {gameState.foxyVariant === 'standard' && 'Variante: Estándar'}
          {gameState.foxyVariant === 'most-seen' && 'Variante: Animal más visto'}
          {gameState.foxyVariant === 'solitary' && 'Variante: Animales solitarios'}
          {gameState.foxyVariant === 'cat-fox' && 'Variante: Zorro Gatuno'}
          {' • '}
          Dificultad: {gameState.difficulty === 'easy' ? 'Fácil' : gameState.difficulty === 'medium' ? 'Medio' : 'Difícil'}
        </p>
      </div>

      {/* Podium - Only show when all cards are revealed */}
      {revealedIndex >= 20 && rankedPlayers.length > 0 && (
        <div className="w-full bg-gradient-to-br from-yellow-50 to-orange-50 p-6 border-b-4 border-yellow-400">
          <div className="flex justify-center items-end gap-4 max-w-2xl mx-auto">
            {rankedPlayers.slice(0, 3).map((stat, idx) => {
              const heights = ['h-32', 'h-40', 'h-28'];
              const colors = [
                'bg-gradient-to-t from-gray-300 to-gray-400',
                'bg-gradient-to-t from-yellow-400 to-yellow-500',
                'bg-gradient-to-t from-amber-600 to-amber-700'
              ];
              const icons = [
                <Medal key="2" className="w-8 h-8 text-gray-600" />,
                <Trophy key="1" className="w-10 h-10 text-yellow-600" />,
                <Award key="3" className="w-7 h-7 text-amber-800" />
              ];
              const order = [1, 0, 2]; // Center winner
              const actualIdx = order[idx];
              const actualStat = rankedPlayers[actualIdx];
              
              return (
                <div key={actualStat.player.id} className="flex flex-col items-center">
                  <div className="text-center mb-2">
                    <div className="font-bold text-gray-800 text-sm truncate max-w-[100px]">
                      {actualStat.player.name}
                    </div>
                    <div className="text-2xl font-extrabold text-indigo-600">
                      {actualStat.totalScore}
                    </div>
                    {actualStat.betScore > 0 && (
                      <div className="text-xs text-orange-600">
                        Apuesta: {actualStat.betScore}
                      </div>
                    )}
                  </div>
                  <div className={`${heights[actualIdx]} ${colors[actualIdx]} w-24 rounded-t-lg shadow-lg flex flex-col items-center justify-start pt-3`}>
                    {icons[actualIdx]}
                    <div className="text-white font-bold text-lg mt-1">#{actualStat.rank}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="w-full flex-1 overflow-auto relative">
        <table className="w-full text-xs sm:text-sm text-left border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-20 shadow-sm">
            <tr>
              <th className="px-2 py-2 sm:px-4 sm:py-3 sticky left-0 z-20 bg-gray-100 border-r border-gray-200 min-w-[100px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Ronda
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-center bg-indigo-50 text-indigo-800 border-r border-indigo-100">
                Real
              </th>
              {gameState.players.map(p => (
                <th key={p.id} className="px-2 py-2 sm:px-4 sm:py-3 text-center min-w-[80px]">
                  <div className="truncate max-w-[80px] sm:max-w-none mx-auto" title={p.name}>
                    {p.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gameState.deck.map((card, idx) => {
              if (idx >= revealedIndex) return null;
              
              const actual = calculateCorrectAnswer(idx, gameState.deck, gameState.foxyVariant);
              const envLabel = card.environment ? ENV_CONFIG[card.environment].label : '';
              
              return (
                <tr key={idx} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-gray-900 flex items-center gap-1 sm:gap-2 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] sm:text-xs shrink-0">{idx + 1}</span>
                    {card.isFoxy ? (
                      <span className="text-orange-500 font-bold truncate">Foxy</span>
                    ) : (
                      <span className="capitalize text-gray-500 truncate">{envLabel}</span>
                    )}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-center font-bold text-indigo-600 bg-indigo-50 border-r border-indigo-100">
                    {actual}
                  </td>
                  {gameState.players.map(p => {
                    const guess = p.guesses[idx];
                    const bet = p.bets[idx];
                    const score = calculateRoundScore(guess, actual, bet);
                    const isPerfect = guess === actual;
                    const isBust = (guess || 0) > actual;
                    const isBetFail = bet && !isPerfect;

                    return (
                      <td key={`${p.id}-${idx}`} className="px-2 py-2 sm:px-4 sm:py-3 text-center border-l border-gray-50">
                        <div className="flex flex-col items-center">
                          <div className={`relative font-mono text-base sm:text-lg ${
                            score > 0 ? 'text-green-600 font-bold' : 'text-gray-400 line-through decoration-red-500'
                          }`}>
                             {guess}
                             {bet && <Circle className="absolute -top-1 -right-2 w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />}
                          </div>
                          
                          {score > 0 && bet && <span className="text-[10px] text-indigo-600 font-bold">x2</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-800 text-white sticky bottom-0 z-20">
             <tr>
               <td className="px-2 py-3 sm:px-4 sm:py-4 font-bold text-right text-xs sm:text-base sticky left-0 bg-gray-800 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)] border-r border-gray-700" colSpan={1}>
                 TOTAL
               </td>
               <td className="bg-gray-700"></td> {/* Spacer for 'Real' column */}
               {gameState.players.map((p, pIdx) => (
                 <td key={p.id} className="px-2 py-3 sm:px-4 sm:py-4 text-center font-extrabold text-base sm:text-xl">
                    {calculateTotalScore(pIdx, revealedIndex)}
                 </td>
               ))}
             </tr>
          </tfoot>
        </table>
      </div>

      <div className="p-4 w-full flex justify-center bg-gray-50 border-t shrink-0">
        <button 
          onClick={onRestart}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 text-sm sm:text-base"
        >
          Jugar de Nuevo
        </button>
      </div>
    </div>
  );
};