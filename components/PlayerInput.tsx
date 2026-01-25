import React, { useState } from 'react';
import { Player } from '../types';
import { Circle, Send } from 'lucide-react';

interface PlayerInputProps {
  player: Player;
  onSubmit: (guess: number, bet: boolean) => void;
  round: number;
}

export const PlayerInput: React.FC<PlayerInputProps> = ({ player, onSubmit, round }) => {
  const [guess, setGuess] = useState<string>('');
  const [bet, setBet] = useState(false);
  const hasUsedBet = player.bets.some(b => b);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess === '') return;
    onSubmit(parseInt(guess, 10), bet);
    setGuess('');
    setBet(false);
  };

  return (
    <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg w-full max-w-sm border border-gray-100 flex flex-col gap-2 sm:gap-4">
      <div className="flex justify-between items-center sm:hidden">
         <span className="text-sm font-bold text-gray-700">Tu Respuesta:</span>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
        <div className="relative">
          <input
            type="number"
            min="0"
            max="100"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="w-full text-3xl sm:text-4xl font-bold text-center py-2 sm:py-4 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring focus:ring-indigo-200 outline-none transition-all"
            placeholder="?"
            inputMode="numeric"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Bet Button */}
          <button
            type="button"
            disabled={hasUsedBet}
            onClick={() => setBet(!bet)}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border-2 transition-all ${
              bet 
                ? 'bg-indigo-600 border-indigo-600 text-white' 
                : hasUsedBet 
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
            }`}
          >
            <Circle className={`w-5 h-5 ${bet ? 'fill-current' : ''}`} />
            <div className="flex flex-col items-start leading-none">
              <span className="font-bold text-sm">x2</span>
              <span className="text-[10px] opacity-80 hidden sm:block">Doble o Nada</span>
            </div>
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={guess === ''}
            className="flex-[2] bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
          >
            <span>Enviar</span> <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};