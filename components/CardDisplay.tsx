import React from 'react';
import { CardData } from '../types';
import { ANIMAL_CONFIG, ENV_CONFIG } from '../constants';
import { AlertCircle } from 'lucide-react';

interface CardDisplayProps {
  card: CardData;
  revealed: boolean;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ card, revealed }) => {
  if (!revealed) {
    return (
      <div className="w-40 h-56 sm:w-64 sm:h-96 bg-indigo-900 rounded-xl shadow-2xl border-4 border-white flex flex-col items-center justify-center transform transition-transform hover:scale-105">
        <div className="text-white font-bold text-2xl sm:text-4xl tracking-widest opacity-20 rotate-45">FOXY</div>
        <div className="mt-2 sm:mt-4 text-indigo-300 text-xs sm:text-base">Ronda Actual</div>
      </div>
    );
  }

  if (card.isFoxy) {
    return (
      <div className="w-40 h-56 sm:w-64 sm:h-96 bg-orange-500 rounded-xl shadow-2xl border-4 border-white flex flex-col items-center justify-between p-3 sm:p-6 relative overflow-hidden animate-pulse">
        <div className="absolute top-0 left-0 w-full h-full bg-orange-600 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-white z-10 drop-shadow-md">¡FOXY!</h2>
        
        <div className="z-10 bg-white p-2 sm:p-4 rounded-full shadow-lg">
          <AlertCircle className="w-10 h-10 sm:w-20 sm:h-20 text-orange-600" />
        </div>

        <div className="z-10 text-center bg-black/20 p-1 sm:p-2 rounded-lg backdrop-blur-sm w-full">
          <p className="text-white font-bold text-xs sm:text-sm leading-tight">Cuenta Especies</p>
          <p className="text-orange-100 text-[10px] sm:text-xs mt-1 hidden sm:block">¿Cuántos tipos diferentes de animales has visto?</p>
        </div>
      </div>
    );
  }

  const env = card.environment ? ENV_CONFIG[card.environment] : ENV_CONFIG.forest;
  const BgIcon = env.icon;

  return (
    <div className={`w-40 h-56 sm:w-64 sm:h-96 ${env.bg} rounded-xl shadow-2xl border-4 border-white flex flex-col relative overflow-hidden transition-all duration-300`}>
      {/* Background Decor */}
      <BgIcon className={`absolute -top-6 -right-6 sm:-top-10 sm:-right-10 w-24 h-24 sm:w-48 sm:h-48 ${env.color} opacity-10`} />
      <BgIcon className={`absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-20 h-20 sm:w-40 sm:h-40 ${env.color} opacity-10`} />

      <div className="p-2 sm:p-4 border-b border-black/5 bg-white/30 backdrop-blur-sm flex justify-center items-center z-10 h-10 sm:h-16">
        <span className={`font-bold uppercase tracking-wider text-sm sm:text-base ${env.color}`}>{env.label}</span>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center z-10 p-2 sm:p-4 ${card.animals.length === 3 ? 'gap-1 sm:gap-3' : 'gap-2 sm:gap-6'}`}>
        {card.animals.map((animal, idx) => {
          const config = ANIMAL_CONFIG[animal];
          const Icon = config.icon;
          const iconSize = card.animals.length === 3 ? 'w-10 h-10 sm:w-16 sm:h-16' : 'w-12 h-12 sm:w-20 sm:h-20';
          return (
            <div key={idx} className="flex flex-col items-center transform transition-transform hover:scale-110">
              <Icon className={`${iconSize} ${config.color} drop-shadow-md`} />
              <span className={`text-[10px] sm:text-xs font-bold uppercase mt-1 px-2 py-0.5 bg-white/80 rounded-full text-gray-600`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};