'use client';

import { useState } from 'react';
import { markPuzzleSolved } from '@/lib/progress';

const RUNES = [
  { id: 3, symbol: '⊕', name: 'Земля', element: 'earth', position: 'top-left' },
  { id: 1, symbol: '△', name: 'Воздух', element: 'air', position: 'top-right' },
  { id: 4, symbol: '≋', name: 'Вода', element: 'water', position: 'bottom-left' },
  { id: 2, symbol: '⋮⋮', name: 'Огонь', element: 'fire', position: 'bottom-right' },
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
    setTimeout(() => setPressedRune(null), 400);

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
    <div className="relative -mx-8 -my-6 min-h-[700px] md:min-h-[800px] overflow-hidden">
      {/* Photorealistic cave stone wall background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 10% 30%, rgba(255, 180, 100, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 70%, rgba(0, 0, 0, 0.6) 0%, transparent 50%),
            linear-gradient(135deg, #0d0a08 0%, #1a1512 30%, #0f0c09 60%, #080604 100%)
          `,
          backgroundSize: 'cover',
        }}
      >
        {/* High-detail stone texture overlay */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px),
              repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px),
              radial-gradient(ellipse at 30% 40%, rgba(80, 60, 40, 0.3) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 80%, rgba(60, 50, 40, 0.2) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Wet stone reflections */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse at 20% 60%, rgba(100, 120, 140, 0.15) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 30%, rgba(80, 100, 120, 0.1) 0%, transparent 35%)
            `,
          }}
        />

        {/* Moss/moisture patches */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            background: `
              radial-gradient(circle at 15% 80%, rgba(40, 60, 30, 0.3) 0%, transparent 25%),
              radial-gradient(circle at 85% 15%, rgba(30, 50, 35, 0.2) 0%, transparent 20%),
              radial-gradient(circle at 50% 50%, rgba(35, 45, 40, 0.15) 0%, transparent 30%)
            `,
          }}
        />

        {/* Deep vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%)',
          }}
        />
      </div>

      {/* Oil lamp glow - bottom left */}
      <div 
        className="absolute bottom-8 left-8 w-48 h-48 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 150, 60, 0.25) 0%, rgba(255, 120, 40, 0.15) 30%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Oil lamp visual */}
      <div className="absolute bottom-12 left-12 w-16 h-20 pointer-events-none">
        <div className="relative w-full h-full">
          {/* Flame */}
          <div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-6 h-8 animate-pulse"
            style={{
              background: 'radial-gradient(ellipse at bottom, rgba(255, 200, 100, 0.9) 0%, rgba(255, 150, 60, 0.7) 40%, rgba(255, 100, 0, 0.3) 70%, transparent 100%)',
              filter: 'blur(2px)',
            }}
          />
          {/* Lamp body */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-4 rounded-full opacity-40"
            style={{
              background: 'linear-gradient(to bottom, rgba(80, 60, 40, 0.8), rgba(40, 30, 20, 0.9))',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 p-8 md:p-12 min-h-[700px] md:min-h-[800px] flex flex-col">
        
        {/* Progress indicators - top left as small stone circles */}
        <div className="absolute top-8 left-8 flex gap-2">
          {[0, 1, 2, 3].map((index) => {
            const runeId = sequence[index];
            const hasRune = runeId !== undefined;
            
            return (
              <div
                key={index}
                className="w-8 h-8 rounded-full relative transition-all duration-300"
                style={{
                  background: hasRune
                    ? failed
                      ? 'radial-gradient(circle, rgba(80, 20, 20, 0.7) 0%, rgba(50, 15, 15, 0.9) 100%)'
                      : 'radial-gradient(circle, rgba(180, 120, 60, 0.5) 0%, rgba(100, 70, 40, 0.8) 100%)'
                    : 'radial-gradient(circle, rgba(40, 35, 30, 0.6) 0%, rgba(25, 20, 18, 0.9) 100%)',
                  boxShadow: hasRune
                    ? 'inset 0 2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(200, 150, 100, 0.3)'
                    : 'inset 0 2px 4px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(60, 50, 40, 0.4)',
                }}
              />
            );
          })}
        </div>

        {/* Title - very subtle */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <h2 
            className="text-lg md:text-xl font-serif tracking-wider opacity-60"
            style={{ 
              color: 'rgba(200, 170, 140, 0.7)',
              textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)',
            }}
          >
            {solved ? 'Проход открыт' : doorOpening ? '...' : 'Тайна Горы'}
          </h2>
        </div>

        {/* Central area - 2x2 grid of carved stone rune plates */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-6 md:gap-10 max-w-md">
            {RUNES.map((rune) => {
              const order = getRuneOrder(rune.id);
              const isPressed = isRuneInSequence(rune.id);
              const isJustPressed = pressedRune === rune.id;

              return (
                <button
                  key={rune.id}
                  onClick={() => handleRuneClick(rune.id)}
                  disabled={solved || doorOpening || isPressed}
                  className="relative group w-28 h-28 md:w-36 md:h-36"
                  style={{ perspective: '1000px' }}
                >
                  {/* Stone plate background - carved into wall */}
                  <div 
                    className={`absolute inset-0 rounded-lg transition-all duration-500`}
                    style={{
                      background: solved
                        ? 'radial-gradient(circle at 35% 35%, rgba(180, 120, 60, 0.4) 0%, rgba(100, 70, 40, 0.6) 40%, rgba(60, 45, 30, 0.8) 100%)'
                        : isPressed
                        ? 'radial-gradient(circle at 35% 35%, rgba(140, 100, 60, 0.3) 0%, rgba(80, 60, 40, 0.5) 40%, rgba(50, 40, 30, 0.7) 100%)'
                        : failed
                        ? 'radial-gradient(circle at 35% 35%, rgba(100, 40, 40, 0.3) 0%, rgba(70, 30, 30, 0.5) 40%, rgba(40, 25, 25, 0.7) 100%)'
                        : 'radial-gradient(circle at 35% 35%, rgba(70, 60, 50, 0.3) 0%, rgba(50, 45, 40, 0.5) 40%, rgba(35, 30, 28, 0.7) 100%)',
                      boxShadow: isPressed || solved
                        ? 'inset 0 4px 12px rgba(0,0,0,0.7), inset 0 -2px 6px rgba(200, 150, 100, 0.1), 0 0 20px rgba(200, 150, 100, 0.15)'
                        : 'inset 0 4px 12px rgba(0,0,0,0.8), inset 0 -2px 6px rgba(100, 80, 60, 0.1)',
                      border: '2px solid rgba(50, 40, 35, 0.6)',
                      transform: isJustPressed ? 'scale(0.98)' : 'scale(1)',
                    }}
                  >
                    {/* Carved grooves texture */}
                    <div 
                      className="absolute inset-0 rounded-lg opacity-40"
                      style={{
                        backgroundImage: `
                          repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px),
                          repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)
                        `,
                      }}
                    />
                    
                    {/* Ember glow on press */}
                    {isJustPressed && (
                      <div 
                        className="absolute inset-0 rounded-lg animate-pulse"
                        style={{
                          background: 'radial-gradient(circle, rgba(255, 180, 100, 0.3) 0%, transparent 70%)',
                        }}
                      />
                    )}

                    {/* Dust particle effect */}
                    {isJustPressed && (
                      <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <div 
                          className="absolute inset-0 animate-ping"
                          style={{
                            background: 'radial-gradient(circle, rgba(200, 150, 100, 0.2) 0%, transparent 60%)',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Carved rune symbol - deeply inset */}
                  <div 
                    className={`relative z-10 w-full h-full flex items-center justify-center text-5xl md:text-6xl font-serif transition-all duration-300`}
                    style={{ 
                      color: solved
                        ? 'rgba(200, 150, 100, 0.7)'
                        : isPressed
                        ? 'rgba(160, 120, 80, 0.6)'
                        : failed
                        ? 'rgba(120, 60, 60, 0.5)'
                        : 'rgba(80, 70, 60, 0.6)',
                      textShadow: isPressed || solved
                        ? '0 2px 4px rgba(0,0,0,0.9), 0 0 12px rgba(255, 180, 100, 0.2), inset 0 -2px 4px rgba(0,0,0,0.5)'
                        : '0 3px 6px rgba(0,0,0,0.9), inset 0 -2px 4px rgba(0,0,0,0.6)',
                      filter: 'contrast(1.1)',
                    }}
                  >
                    {rune.symbol}
                  </div>

                  {/* Order number - small carved notch */}
                  {order !== null && (
                    <div 
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: 'radial-gradient(circle, rgba(140, 100, 60, 0.7) 0%, rgba(80, 60, 40, 0.9) 100%)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), 0 0 8px rgba(200, 150, 100, 0.3)',
                        border: '1px solid rgba(100, 80, 60, 0.5)',
                        color: 'rgba(255, 220, 180, 0.9)',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                      }}
                    >
                      {order}
                    </div>
                  )}

                  {/* Hover glow - torch light catching the edge */}
                  {!solved && !isPressed && !doorOpening && (
                    <div 
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(200, 150, 100, 0.15) 0%, transparent 60%)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Torn parchment riddle - bottom right */}
        {!solved && (
          <div className="absolute bottom-8 right-8 max-w-xs md:max-w-sm">
            <div 
              className="relative p-5 md:p-6"
              style={{
                background: `
                  linear-gradient(135deg, rgba(220, 200, 170, 0.95) 0%, rgba(200, 180, 150, 0.97) 50%, rgba(190, 170, 140, 0.95) 100%)
                `,
                clipPath: 'polygon(2% 0%, 98% 0%, 100% 3%, 100% 92%, 97% 98%, 95% 100%, 8% 100%, 3% 98%, 0% 95%, 0% 5%)',
                filter: 'drop-shadow(3px 5px 15px rgba(0,0,0,0.7))',
              }}
            >
              {/* Burnt edges effect */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(ellipse at 95% 5%, rgba(60, 40, 20, 0.8) 0%, transparent 15%),
                    radial-gradient(ellipse at 5% 95%, rgba(50, 35, 20, 0.7) 0%, transparent 12%),
                    radial-gradient(ellipse at 92% 88%, rgba(55, 35, 20, 0.6) 0%, transparent 10%)
                  `,
                }}
              />

              {/* Stains and aging */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply"
                style={{
                  background: `
                    radial-gradient(circle at 70% 30%, rgba(120, 80, 40, 0.5) 0%, transparent 25%),
                    radial-gradient(circle at 30% 70%, rgba(100, 70, 50, 0.4) 0%, transparent 20%),
                    radial-gradient(circle at 85% 60%, rgba(90, 65, 45, 0.3) 0%, transparent 15%)
                  `,
                }}
              />

              {/* Paper texture */}
              <div 
                className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(100, 80, 60, 0.1) 1px, rgba(100, 80, 60, 0.1) 2px),
                    repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(100, 80, 60, 0.1) 1px, rgba(100, 80, 60, 0.1) 2px)
                  `,
                }}
              />

              {/* Riddle text */}
              <div className="relative">
                <p 
                  className="text-sm md:text-base leading-relaxed italic text-center font-serif"
                  style={{ 
                    color: 'rgba(50, 35, 25, 0.95)',
                    textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)',
                  }}
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

        {/* Reset button - minimal */}
        {!solved && sequence.length > 0 && !doorOpening && (
          <button
            onClick={() => setSequence([])}
            className="absolute top-20 right-8 text-xs px-3 py-1 rounded transition-all duration-300"
            style={{
              background: 'rgba(40, 35, 30, 0.5)',
              border: '1px solid rgba(80, 70, 60, 0.3)',
              color: 'rgba(150, 130, 110, 0.8)',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              backdropFilter: 'blur(4px)',
            }}
          >
            сбросить
          </button>
        )}

        {/* Door crack when opening */}
        {doorOpening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="w-1 h-full animate-pulse"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 180, 100, 0.6) 20%, rgba(255, 180, 100, 0.8) 50%, rgba(255, 180, 100, 0.6) 80%, transparent 100%)',
                boxShadow: '0 0 30px 15px rgba(255, 180, 100, 0.4)',
                filter: 'blur(2px)',
              }}
            />
          </div>
        )}

        {/* Failure message */}
        {failed && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center">
            <p 
              className="text-sm px-4 py-2 rounded"
              style={{
                background: 'rgba(80, 30, 30, 0.6)',
                border: '1px solid rgba(120, 50, 50, 0.4)',
                color: 'rgba(200, 150, 140, 0.9)',
                textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                backdropFilter: 'blur(6px)',
              }}
            >
              Камень не поддаётся...
            </p>
          </div>
        )}

        {/* Success overlay */}
        {solved && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-30">
            <div 
              className="max-w-lg p-8 rounded-lg text-center space-y-4"
              style={{
                background: 'linear-gradient(135deg, rgba(60, 50, 40, 0.95) 0%, rgba(40, 35, 30, 0.97) 100%)',
                border: '2px solid rgba(140, 100, 60, 0.5)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200, 150, 100, 0.1)',
              }}
            >
              <div 
                className="text-5xl mb-4 animate-pulse"
                style={{ 
                  color: 'rgba(255, 200, 120, 0.9)',
                  filter: 'drop-shadow(0 0 20px rgba(255, 180, 100, 0.5))',
                }}
              >
                ✦
              </div>
              <h3 
                className="text-2xl md:text-3xl font-serif"
                style={{ 
                  color: 'rgba(220, 180, 140, 0.95)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                }}
              >
                Дверь отворилась
              </h3>
              <p 
                className="text-sm leading-relaxed"
                style={{ 
                  color: 'rgba(180, 160, 140, 0.9)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}
              >
                Древний камень медленно уходит в стену, открывая тёмный проход.
                Тёплый воздух вырывается из глубины, неся запах земли и забытых веков.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 rounded text-sm font-medium transition-all duration-300"
                  style={{
                    background: 'rgba(100, 70, 40, 0.7)',
                    border: '1px solid rgba(140, 100, 60, 0.6)',
                    color: 'rgba(220, 200, 180, 0.95)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  Закрыть проход
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Opening message */}
        {doorOpening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <p 
              className="text-lg md:text-xl font-serif animate-pulse px-6 py-3 rounded"
              style={{
                background: 'rgba(40, 35, 30, 0.8)',
                border: '1px solid rgba(140, 100, 60, 0.4)',
                color: 'rgba(220, 180, 140, 0.95)',
                textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Руны светятся...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
