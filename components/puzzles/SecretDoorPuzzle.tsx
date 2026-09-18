'use client';

import { useState } from 'react';
import { markPuzzleSolved } from '@/lib/progress';
import Image from 'next/image';

// Rune positions mapped to the actual carved runes in the concept image
// Using percentage-based positioning to overlay clickable areas
const RUNES = [
  { id: 3, name: 'Земля', element: 'earth', position: { top: '22%', left: '22%' } },
  { id: 1, name: 'Воздух', element: 'air', position: { top: '22%', left: '44%' } },
  { id: 4, name: 'Вода', element: 'water', position: { top: '44%', left: '22%' } },
  { id: 2, name: 'Огонь', element: 'fire', position: { top: '44%', left: '44%' } },
];

const CORRECT_SEQUENCE = [3, 1, 4, 2]; // Earth, Air, Water, Fire

export default function SecretDoorPuzzle() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [doorOpening, setDoorOpening] = useState(false);
  const [hoveredRune, setHoveredRune] = useState<number | null>(null);
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
      }, 2500);
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

  const isRuneInSequence = (id: number) => sequence.includes(id);

  return (
    <div className="relative -mx-8 -my-6 w-screen h-screen max-w-full max-h-full min-h-[600px] overflow-hidden bg-black">
      {/* The actual concept image as background - this IS the UI */}
      <div className="absolute inset-0">
        <Image
          src="/puzzles/secret-door/scene.png"
          alt="Secret cave door"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      {/* Invisible clickable hotspots positioned over the carved runes */}
      {RUNES.map((rune) => {
        const isPressed = isRuneInSequence(rune.id);
        const isHovered = hoveredRune === rune.id;
        const isJustPressed = pressedRune === rune.id;

        return (
          <button
            key={rune.id}
            onClick={() => handleRuneClick(rune.id)}
            onMouseEnter={() => setHoveredRune(rune.id)}
            onMouseLeave={() => setHoveredRune(null)}
            disabled={solved || doorOpening || isPressed}
            className="absolute w-[15%] aspect-square cursor-pointer transition-all duration-200"
            style={{
              top: rune.position.top,
              left: rune.position.left,
              transform: isJustPressed ? 'scale(0.95)' : 'scale(1)',
            }}
            title={rune.name}
          >
            {/* Very subtle hover glow - torch light catching the stone */}
            {isHovered && !isPressed && (
              <div
                className="absolute inset-0 rounded-full transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 180, 100, 0.15) 0%, transparent 70%)',
                  boxShadow: '0 0 30px rgba(255, 180, 100, 0.2)',
                }}
              />
            )}

            {/* Pressed state - ember glow */}
            {isPressed && (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 150, 80, 0.25) 0%, transparent 70%)',
                  boxShadow: 'inset 0 0 20px rgba(255, 150, 80, 0.3)',
                }}
              />
            )}

            {/* Just pressed - dust pulse */}
            {isJustPressed && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 180, 100, 0.3) 0%, transparent 60%)',
                }}
              />
            )}
          </button>
        );
      })}

      {/* Progress indicators - subtle highlights on the 4 stone circles top-left in the image */}
      <div className="absolute top-[3%] left-[3%] flex gap-[1%]">
        {[0, 1, 2, 3].map((index) => {
          const hasRune = sequence[index] !== undefined;
          return (
            <div
              key={index}
              className="w-[32px] h-[32px] rounded-full transition-all duration-300"
              style={{
                background: hasRune
                  ? failed
                    ? 'radial-gradient(circle, rgba(255, 80, 80, 0.4) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(255, 180, 100, 0.4) 0%, transparent 70%)'
                  : 'transparent',
                boxShadow: hasRune
                  ? '0 0 15px rgba(255, 180, 100, 0.3)'
                  : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Russian hint - minimal overlay not covering the parchment art */}
      {!solved && (
        <div className="absolute top-[4%] left-1/2 -translate-x-1/2 text-center">
          <p
            className="text-xs md:text-sm font-serif italic opacity-70"
            style={{
              color: 'rgba(220, 200, 180, 0.9)',
              textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,1)',
            }}
          >
            Найдите правильную последовательность стихий
          </p>
        </div>
      )}

      {/* Failure overlay - brief red vignette */}
      {failed && (
        <div
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(150, 30, 30, 0.4) 100%)',
            animation: 'pulse 0.5s ease-out',
          }}
        />
      )}

      {/* Door opening - amber crack overlay */}
      {doorOpening && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-1 h-full animate-pulse"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 180, 100, 0.7) 20%, rgba(255, 180, 100, 0.9) 50%, rgba(255, 180, 100, 0.7) 80%, transparent 100%)',
              boxShadow: '0 0 40px 20px rgba(255, 180, 100, 0.5)',
              filter: 'blur(3px)',
            }}
          />
        </div>
      )}

      {/* Success overlay - minimal message, doesn't replace the scene */}
      {solved && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="max-w-md p-8 rounded-lg text-center space-y-4"
            style={{
              background: 'rgba(30, 25, 20, 0.95)',
              border: '2px solid rgba(200, 150, 100, 0.4)',
              boxShadow: '0 10px 50px rgba(0,0,0,0.9)',
            }}
          >
            <div
              className="text-5xl mb-4"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 180, 100, 0.6))',
              }}
            >
              ✦
            </div>
            <h3
              className="text-2xl md:text-3xl font-serif mb-2"
              style={{
                color: 'rgba(220, 180, 140, 0.95)',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              Дверь открыта
            </h3>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{
                color: 'rgba(200, 180, 160, 0.9)',
              }}
            >
              Древний камень отступает, открывая проход в глубины горы.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded text-sm font-medium transition-all"
              style={{
                background: 'rgba(120, 80, 50, 0.8)',
                border: '1px solid rgba(180, 140, 100, 0.5)',
                color: 'rgba(230, 210, 190, 0.95)',
              }}
            >
              Закрыть проход
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
