'use client';

import { useState } from 'react';
import { markPuzzleSolved } from '@/lib/progress';

const RUNES = [
  { id: 3, symbol: '⊕', name: 'Земля', element: 'earth' },
  { id: 1, symbol: '△', name: 'Воздух', element: 'air' },
  { id: 4, symbol: '≋', name: 'Вода', element: 'water' },
  { id: 2, symbol: '⋮⋮', name: 'Огонь', element: 'fire' },
];

const CORRECT_SEQUENCE = [3, 1, 4, 2];

export default function SecretDoorPuzzle() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [doorOpening, setDoorOpening] = useState(false);
  const [pressedRune, setPressedRune] = useState<number | null>(null);

  const handleRuneClick = (id: number) => {
    if (solved || doorOpening || sequence.length >= 4) return;

    setPressedRune(id);
    setTimeout(() => setPressedRune(null), 300);

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
      }, 3000);
    } else {
      setFailed(true);
      setTimeout(() => {
        setSequence([]);
        setFailed(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    setSequence([]);
    setFailed(false);
    setSolved(false);
    setDoorOpening(false);
  };

  const isRuneInSequence = (id: number) => sequence.includes(id);
  const getRuneOrder = (id: number) => {
    const index = sequence.indexOf(id);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="relative -mx-8 -my-6 min-h-[600px] md:min-h-[700px]">
      {/* Full-bleed cave background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='800' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='1200' height='800' fill='%23181410'/%3E%3Crect width='1200' height='800' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundColor: '#0a0806',
        }}
      >
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/80" />
        
        {/* Texture overlay for cave wall feeling */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.1) 2px, rgba(0,0,0,.1) 4px),
                             repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.1) 2px, rgba(0,0,0,.1) 4px)`
          }}
        />
      </div>

      {/* Torch light effect */}
      <div className="absolute top-0 left-8 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl" />
      
      {/* Main content */}
      <div className="relative z-10 p-8 flex flex-col min-h-[600px] md:min-h-[700px]">
        
        {/* Title - minimal chrome */}
        <div className="mb-6">
          <h2 className="text-amber-200/90 text-xl md:text-2xl font-serif tracking-wide" 
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
            {solved ? 'Проход открыт' : doorOpening ? 'Древняя магия пробуждается...' : 'Тайна Горы'}
          </h2>
        </div>

        {/* Central door area */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          
          {/* Door crack effect when opening */}
          {doorOpening && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-1 h-full bg-gradient-to-b from-transparent via-amber-500/60 to-transparent animate-pulse"
                style={{ boxShadow: '0 0 20px 10px rgba(251, 191, 36, 0.3)' }} />
            </div>
          )}

          {/* Stone runes carved into wall */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-2xl">
            {RUNES.map((rune) => {
              const order = getRuneOrder(rune.id);
              const isPressed = isRuneInSequence(rune.id);
              const isJustPressed = pressedRune === rune.id;

              return (
                <button
                  key={rune.id}
                  onClick={() => handleRuneClick(rune.id)}
                  disabled={solved || doorOpening || isPressed}
                  className="relative group"
                  style={{ width: '100px', height: '100px' }}
                >
                  {/* Stone circle background */}
                  <div 
                    className={`absolute inset-0 rounded-full transition-all duration-500 ${
                      solved 
                        ? 'bg-amber-900/40 shadow-[inset_0_0_20px_rgba(251,191,36,0.4)]'
                        : isPressed
                        ? 'bg-amber-950/60 shadow-[inset_0_0_15px_rgba(251,191,36,0.2)]'
                        : failed
                        ? 'bg-red-950/40 shadow-[inset_0_0_15px_rgba(127,29,29,0.3)]'
                        : 'bg-stone-950/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]'
                    } backdrop-blur-sm border border-stone-800/50`}
                    style={{
                      backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent)',
                    }}
                  >
                    {/* Dust/ember effect on press */}
                    {isJustPressed && (
                      <div className="absolute inset-0 rounded-full bg-amber-600/30 animate-ping" />
                    )}
                  </div>

                  {/* Carved rune symbol */}
                  <div 
                    className={`relative z-10 w-full h-full flex items-center justify-center text-4xl md:text-5xl transition-all duration-300 ${
                      solved
                        ? 'text-amber-500/90'
                        : isPressed
                        ? 'text-amber-700/80'
                        : failed
                        ? 'text-red-900/60'
                        : 'text-stone-600 group-hover:text-stone-500'
                    }`}
                    style={{ 
                      textShadow: isPressed || solved 
                        ? '0 0 10px rgba(251, 191, 36, 0.3), 0 2px 4px rgba(0,0,0,0.8)' 
                        : '0 2px 4px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    {rune.symbol}
                  </div>

                  {/* Order indicator - carved notch */}
                  {order !== null && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-stone-900/80 border border-amber-800/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-amber-600/90 text-xs font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        {order}
                      </span>
                    </div>
                  )}

                  {/* Hover glow for active runes */}
                  {!solved && !isPressed && !doorOpening && (
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-amber-950/20 shadow-[inset_0_0_15px_rgba(251,191,36,0.15)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sequence progress - stone notches */}
          <div className="flex gap-3 p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-stone-800/30">
            {[0, 1, 2, 3].map((index) => {
              const runeId = sequence[index];
              const rune = runeId ? RUNES.find((r) => r.id === runeId) : null;
              
              return (
                <div
                  key={index}
                  className={`w-10 h-10 rounded border flex items-center justify-center text-lg transition-all duration-300 ${
                    rune
                      ? failed
                        ? 'bg-red-950/50 border-red-900/60 text-red-800/80 shadow-[inset_0_0_10px_rgba(127,29,29,0.3)]'
                        : 'bg-amber-950/50 border-amber-900/60 text-amber-700/90 shadow-[inset_0_0_10px_rgba(251,191,36,0.2)]'
                      : 'bg-stone-950/30 border-stone-800/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {rune?.symbol}
                </div>
              );
            })}
          </div>

          {/* Reset button - subtle */}
          {!solved && sequence.length > 0 && !doorOpening && (
            <button
              onClick={() => setSequence([])}
              className="text-xs text-stone-500 hover:text-stone-400 transition-colors px-3 py-1 rounded border border-stone-800/30 bg-black/20 backdrop-blur-sm"
            >
              сбросить
            </button>
          )}
        </div>

        {/* Parchment riddle - diegetic */}
        {!solved && (
          <div className="mt-auto">
            <div 
              className="relative mx-auto max-w-md p-6 bg-amber-50/95 rounded-sm shadow-2xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23f5f5dc' surfaceScale='1'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='400' height='300' fill='%23e8dcc4' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
                border: '1px solid rgba(120, 80, 40, 0.3)',
                transform: 'rotate(-0.5deg)',
              }}
            >
              {/* Torn edge effect */}
              <div className="absolute -top-1 left-0 right-0 h-2 bg-gradient-to-b from-amber-900/10 to-transparent" />
              <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-t from-amber-900/10 to-transparent" />
              
              {/* Stains */}
              <div className="absolute top-2 right-4 w-8 h-8 bg-amber-900/5 rounded-full blur-sm" />
              <div className="absolute bottom-4 left-6 w-6 h-6 bg-stone-900/5 rounded-full blur-sm" />

              <div className="relative">
                <p 
                  className="text-stone-800 text-sm leading-relaxed italic text-center font-serif"
                  style={{ textShadow: '0 1px 1px rgba(255,255,255,0.5)' }}
                >
                  Из земли родился,<br />
                  воздухом вознесся,<br />
                  водой очистился,<br />
                  огнём закалился.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Failure message - subtle */}
        {failed && (
          <div className="mt-4 mx-auto max-w-md text-center">
            <p className="text-red-400/80 text-sm backdrop-blur-sm bg-black/30 px-4 py-2 rounded border border-red-900/30">
              Камень не поддаётся...
            </p>
          </div>
        )}

        {/* Success state */}
        {solved && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
            <div className="max-w-lg p-8 bg-gradient-to-br from-amber-950/90 to-stone-950/90 rounded-lg border border-amber-800/40 shadow-2xl text-center space-y-4">
              <div className="text-5xl mb-4 animate-pulse">✦</div>
              <h3 className="text-2xl md:text-3xl font-serif text-amber-400">
                Дверь отворилась
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Древний камень медленно уходит в стену, открывая тёмный проход.
                Тёплый воздух вырывается из глубины, неся запах земли и забытых веков.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="bg-amber-900/60 hover:bg-amber-800/60 text-amber-200 px-6 py-2 rounded border border-amber-700/50 transition-colors text-sm font-medium backdrop-blur-sm"
                >
                  Закрыть проход
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Opening state overlay */}
        {doorOpening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <p className="text-amber-400/90 text-lg md:text-xl font-serif animate-pulse backdrop-blur-sm bg-black/40 px-6 py-3 rounded border border-amber-900/30">
              Руны светятся...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
