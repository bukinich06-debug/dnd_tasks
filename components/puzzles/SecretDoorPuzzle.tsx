'use client';

import { useState, useEffect } from 'react';
import { markPuzzleSolved } from '@/lib/progress';

const RUNES = [
  { id: 1, symbol: '🜁', name: 'Воздух' },
  { id: 2, symbol: '🜂', name: 'Огонь' },
  { id: 3, symbol: '🜃', name: 'Земля' },
  { id: 4, symbol: '🜄', name: 'Вода' },
];

const CORRECT_SEQUENCE = [3, 1, 4, 2]; // Earth, Air, Water, Fire

export default function SecretDoorPuzzle() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [doorOpening, setDoorOpening] = useState(false);

  const handleRuneClick = (id: number) => {
    if (solved || doorOpening || sequence.length >= 4) return;

    const newSequence = [...sequence, id];
    setSequence(newSequence);
    setFailed(false);

    if (newSequence.length === 4) {
      checkSolution(newSequence);
    }
  };

  const checkSolution = (seq: number[]) => {
    if (JSON.stringify(seq) === JSON.stringify(CORRECT_SEQUENCE)) {
      setDoorOpening(true);
      setTimeout(() => {
        setSolved(true);
        setDoorOpening(false);
        markPuzzleSolved('secret-door');
      }, 2000);
    } else {
      setFailed(true);
      setTimeout(() => {
        setSequence([]);
        setFailed(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    setSequence([]);
    setFailed(false);
    setSolved(false);
    setDoorOpening(false);
  };

  const isRunePressed = (id: number) => sequence.includes(id);
  const getRunePressOrder = (id: number) => {
    const index = sequence.indexOf(id);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="space-y-6">
      {/* Story/Atmosphere */}
      <div className="bg-gradient-to-br from-stone-800 to-stone-900 p-6 rounded-lg border-2 border-stone-700 text-stone-100 shadow-2xl">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">🏰</span>
          <div>
            <h3 className="font-bold text-lg text-amber-400 mb-2">Тайный проход</h3>
            <p className="text-sm leading-relaxed">
              Глубоко в пещере вы обнаруживаете каменную стену, но что-то в ней не так...
              При ближайшем рассмотрении вы замечаете едва заметные трещины, образующие
              контур двери. На камне высечены четыре древних руны стихий.
            </p>
          </div>
        </div>
        <div className="bg-stone-950/50 p-3 rounded border border-amber-700/30 mt-3">
          <p className="text-xs text-amber-200/80 italic">
            💡 Подсказка: "Из земли родился, воздухом вознесся, водой очистился, огнём закалился"
          </p>
        </div>
      </div>

      {/* The Secret Door */}
      <div className="relative">
        <div
          className={`bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 rounded-xl p-8 border-4 transition-all duration-2000 ${
            doorOpening
              ? 'border-amber-500 shadow-2xl shadow-amber-500/50 scale-105'
              : failed
              ? 'border-red-600 shadow-lg shadow-red-600/50'
              : 'border-stone-600 shadow-xl'
          }`}
        >
          {/* Door crack effect when opening */}
          {doorOpening && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-full bg-gradient-to-b from-transparent via-amber-400 to-transparent animate-pulse" />
            </div>
          )}

          {/* Title */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-stone-200 mb-2">
              {solved ? '✨ Дверь открыта! ✨' : 'Руны Стихий'}
            </h3>
            <p className="text-stone-400 text-sm">
              {solved
                ? 'Проход свободен'
                : sequence.length === 0
                ? 'Нажмите руны в правильной последовательности'
                : `Нажато: ${sequence.length} / 4`}
            </p>
          </div>

          {/* Runes Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {RUNES.map((rune) => {
              const pressOrder = getRunePressOrder(rune.id);
              const isPressed = isRunePressed(rune.id);

              return (
                <button
                  key={rune.id}
                  onClick={() => handleRuneClick(rune.id)}
                  disabled={solved || doorOpening || isPressed}
                  className={`relative aspect-square rounded-xl font-bold text-6xl transition-all duration-300 ${
                    solved
                      ? 'bg-amber-600 text-amber-100 shadow-lg shadow-amber-600/50'
                      : isPressed
                      ? 'bg-amber-700 text-amber-100 shadow-lg shadow-amber-700/50 cursor-not-allowed'
                      : failed
                      ? 'bg-red-800 text-red-200 shadow-lg shadow-red-800/50'
                      : 'bg-stone-600 text-stone-300 hover:bg-stone-500 hover:scale-105 hover:shadow-xl cursor-pointer active:scale-95'
                  } flex items-center justify-center border-2 ${
                    isPressed ? 'border-amber-400' : 'border-stone-500'
                  }`}
                  title={rune.name}
                >
                  {rune.symbol}
                  {pressOrder !== null && (
                    <span className="absolute top-2 right-2 bg-amber-900 text-amber-100 text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center border-2 border-amber-400">
                      {pressOrder}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sequence Display */}
          <div className="flex justify-center gap-3 mb-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl transition-all ${
                  sequence[index]
                    ? failed
                      ? 'bg-red-900/50 border-red-600 text-red-200'
                      : 'bg-amber-900/50 border-amber-600 text-amber-200'
                    : 'bg-stone-700/50 border-stone-500'
                }`}
              >
                {sequence[index] && RUNES.find((r) => r.id === sequence[index])?.symbol}
              </div>
            ))}
          </div>

          {/* Reset Button */}
          {!solved && sequence.length > 0 && !doorOpening && (
            <div className="text-center">
              <button
                onClick={() => setSequence([])}
                className="text-sm text-stone-400 hover:text-stone-200 underline"
              >
                Сбросить последовательность
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Failure Message */}
      {failed && (
        <div className="bg-red-900/20 border-2 border-red-700 p-4 rounded-lg text-center animate-pulse">
          <p className="text-red-200 font-semibold">
            ⚠️ Неверная последовательность! Дверь остаётся запертой.
          </p>
        </div>
      )}

      {/* Success Message */}
      {solved && (
        <div className="bg-gradient-to-br from-amber-900/30 to-green-900/30 border-2 border-amber-600 p-8 rounded-xl text-center space-y-4 shadow-2xl">
          <div className="text-6xl mb-4">🚪✨</div>
          <h3 className="text-3xl font-bold text-amber-300">Дверь открылась!</h3>
          <p className="text-stone-200 text-lg">
            Камень медленно отъезжает в сторону, открывая тёмный проход вглубь пещеры.
            Древняя магия рун исчезает, оставляя слабое золотистое свечение.
          </p>
          <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg inline-block">
            <p className="text-green-200 text-sm">
              🎖️ Загадка решена! Вы можете продолжить своё путешествие.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="mt-4 bg-amber-700 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Door Opening Animation State */}
      {doorOpening && (
        <div className="bg-amber-900/20 border-2 border-amber-600 p-4 rounded-lg text-center">
          <p className="text-amber-200 font-semibold animate-pulse">
            ✨ Руны светятся... Дверь открывается...
          </p>
        </div>
      )}
    </div>
  );
}
