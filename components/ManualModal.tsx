import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, BookOpen, AlertCircle, Eye, CheckCircle2, Plus } from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const [page, setPage] = useState(0);

  if (!isOpen) return null;

  const pages = [
    {
      title: "Objetivo del Juego",
      icon: <Eye className="w-12 h-12 text-indigo-500" />,
      content: (
        <div className="space-y-4">
          <p>
            ¡Bienvenido a <strong>Foxy Digital</strong>! Pon a prueba tu memoria y capacidad de observación.
          </p>
          <p>
            En cada ronda se revelará una carta. Tu objetivo es recordar <strong>cuántos animales de ese tipo específico</strong> han aparecido en TOTAL desde el principio de la partida hasta ahora.
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg text-sm text-indigo-800">
            <strong>Ejemplo:</strong> Si sale un "Cerdo" en la ronda 3, y ya salieron cerdos en la ronda 1 y 2, ¡debes sumar todos!
          </div>
        </div>
      )
    },
    {
      title: "Cómo Jugar",
      icon: <BookOpen className="w-12 h-12 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>El juego consta de <strong>20 rondas</strong>.</li>
            <li>En cada turno, mira la carta actual y los animales que aparecen en ella.</li>
            <li>Escribe en el recuadro cuántos animales de esos tipos has visto en total (sumando las cartas anteriores y la actual).</li>
            <li>No puedes tomar notas, ¡solo confía en tu memoria!</li>
          </ul>
        </div>
      )
    },
    {
      title: "¿Ves múltiples animales?",
      icon: <Plus className="w-12 h-12 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p>
            Algunas cartas muestran dos animales (ejemplo: un Cerdo y un Gallo) o incluso tres.
          </p>
          <p className="font-bold text-lg text-center text-indigo-600">
            ¡Debes sumarlos todos!
          </p>
          <div className="bg-purple-50 p-4 rounded-lg text-sm text-purple-800 border-l-4 border-purple-500">
            Si la carta muestra <strong>Cerdo + Gallo</strong>, tu respuesta debe ser:
            <br/>
            (Todos los cerdos vistos hasta ahora) + (Todos los gallos vistos hasta ahora).
          </div>
        </div>
      )
    },
    {
      title: "La Carta Foxy",
      icon: <AlertCircle className="w-12 h-12 text-orange-500" />,
      content: (
        <div className="space-y-4">
          <p>
            ¡Cuidado con el zorro! Cuando aparece la carta <strong>FOXY</strong>, las reglas cambian por una ronda.
          </p>
          <p>
            En lugar de contar un animal específico, debes contar <strong>cuántos TIPOS de animales diferentes</strong> han aparecido en la partida hasta el momento.
          </p>
          <div className="bg-orange-50 p-4 rounded-lg text-sm text-orange-800 border-l-4 border-orange-500">
            ¿Hemos visto cerdos, gatos y cebras? Entonces la respuesta es 3.
          </div>
        </div>
      )
    },
    {
      title: "Puntuación",
      icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p>Al final de las 20 rondas, revisaremos tus respuestas:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>
              <strong>Si tu número es igual o menor</strong> al real: Ganas esa cantidad de puntos.
              <br/><span className="text-gray-500 text-xs">Ej: Respuesta real 5, dijiste 4 {'→'} Ganas 4 puntos.</span>
            </li>
            <li>
              <strong>Si te pasas</strong> del número real: Ganas 0 puntos.
              <br/><span className="text-gray-500 text-xs">Ej: Respuesta real 5, dijiste 6 {'→'} Ganas 0 puntos.</span>
            </li>
            <li>
              <strong>Puntos Dobles (Apuesta):</strong> Una vez por partida puedes marcar el círculo. Si aciertas EXACTAMENTE el número, ganas el doble. Si fallas (aunque sea por poco), ganas 0.
            </li>
          </ul>
        </div>
      )
    }
  ];

  const nextPage = () => setPage(prev => Math.min(prev + 1, pages.length - 1));
  const prevPage = () => setPage(prev => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-gray-700">Manual de Juego</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center flex-1 overflow-y-auto">
          <div className="mb-6 animate-fade-in">
            {pages[page].icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{pages[page].title}</h3>
          <div className="text-gray-600 text-left w-full">
            {pages[page].content}
          </div>
        </div>

        {/* Footer / Navigation */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <button 
            onClick={prevPage} 
            disabled={page === 0}
            className="flex items-center gap-1 text-sm font-bold text-indigo-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} /> Anterior
          </button>

          <div className="flex gap-2">
            {pages.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all ${idx === page ? 'bg-indigo-600 w-4' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          {page === pages.length - 1 ? (
            <button 
              onClick={onClose}
              className="flex items-center gap-1 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              ¡Entendido!
            </button>
          ) : (
            <button 
              onClick={nextPage}
              className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
            >
              Siguiente <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};