'use client';

import { useState } from 'react';
import { markPuzzleSolved } from '@/lib/progress';
import Image from 'next/image';

// scene.png is 1280×720. Positions are percentages of the image, centered on each carved rune.
const IMAGE_WIDTH = 1280;
const IMAGE_HEIGHT = 720;

const RUNES = [
  { id: 3, name: 'Земля', element: 'earth', position: { top: 0.317, left: 0.452 } },  // Top-left rune (Earth)
  { id: 1, name: 'Воздух', element: 'air', position: { top: 0.317, left: 0.561 } },   // Top-right rune (Air)
  { id: 4, name: 'Вода', element: 'water', position: { top: 0.553, left: 0.452 } },   // Bottom-left rune (Water)
  { id: 2, name: 'Огонь', element: 'fire', position: { top: 0.553, left: 0.561 } },   // Bottom-right rune (Fire)
];

const CORRECT_SEQUENCE = [3, 1, 4, 2]; // Earth, Air, Water, Fire

export default function SecretDoorPuzzle() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [doorOpening, setDoorOpening] = useState(false);
  const [hoveredRune, setHoveredRune] = useState<number | null>(null);

  const handleRuneClick = (id: number) => {
    if (solved || doorOpening) return;
    
    // Allow clicking if sequence isn't full yet
    if (sequence.length >= 4) return;

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
      }, 1800);
    }
  };

  const handleReset = () => {
    setSequence([]);
    setFailed(false);
    setSolved(false);
    setDoorOpening(false);
  };

  const getRuneOrder = (id: number) => {
    const index = sequence.indexOf(id);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Image stage: same aspect as scene.png, scaled to cover the viewport */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `max(100vw, calc(100vh * ${IMAGE_WIDTH} / ${IMAGE_HEIGHT}))`,
          height: `max(100vh, calc(100vw * ${IMAGE_HEIGHT} / ${IMAGE_WIDTH}))`,
          containerType: 'size',
        }}
      >
        <Image
          src="/puzzles/secret-door/scene.png"
          alt="Secret cave door"
          fill
          className="object-cover"
          priority
          quality={100}
        />

        {RUNES.map((rune) => {
          const order = getRuneOrder(rune.id);
          const isInSequence = order !== null;
          const isHovered = hoveredRune === rune.id;
          const isClickable = !solved && !doorOpening && sequence.length < 4;

          return (
            <button
              key={rune.id}
              onClick={() => handleRuneClick(rune.id)}
              onMouseEnter={() => setHoveredRune(rune.id)}
              onMouseLeave={() => setHoveredRune(null)}
              disabled={!isClickable}
              className="absolute z-20 cursor-pointer transition-all duration-200"
              style={{
                left: `${rune.position.left * 100}%`,
                top: `${rune.position.top * 100}%`,
                width: `${(10 * IMAGE_HEIGHT) / IMAGE_WIDTH}%`,
                height: '10%',
                transform: 'translate(-50%, -50%)',
              }}
              title={rune.name}
            >
              <div
                className="absolute inset-0 rounded-full transition-all duration-300"
                style={{
                  border: isInSequence
                    ? '3px solid rgba(255, 180, 100, 0.7)'
                    : isHovered && isClickable
                    ? '3px solid rgba(255, 200, 120, 0.5)'
                    : '2px solid rgba(150, 120, 90, 0.4)',
                  boxShadow: isInSequence
                    ? '0 0 20px rgba(255, 180, 100, 0.5), inset 0 0 20px rgba(255, 180, 100, 0.2)'
                    : isHovered && isClickable
                    ? '0 0 15px rgba(255, 200, 120, 0.4)'
                    : '0 0 8px rgba(150, 120, 90, 0.3)',
                  background: isInSequence
                    ? 'radial-gradient(circle, rgba(255, 180, 100, 0.15) 0%, transparent 70%)'
                    : isHovered && isClickable
                    ? 'radial-gradient(circle, rgba(255, 200, 120, 0.1) 0%, transparent 70%)'
                    : 'transparent',
                }}
              />

              {order !== null && (
                <div
                  className="absolute inset-0 flex items-center justify-center font-bold"
                  style={{
                    fontSize: '5cqh',
                    color: 'rgba(255, 220, 180, 0.95)',
                    textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(255, 180, 100, 0.6)',
                  }}
                >
                  {order}
                </div>
              )}

              {isHovered && isClickable && (
                <div
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 200, 120, 0.2) 0%, transparent 60%)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Instruction text - positioned at top center */}
      {!solved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 text-center px-4 z-10">
          <p
            className="text-sm md:text-base font-serif"
            style={{
              color: 'rgba(230, 210, 180, 0.95)',
              textShadow: '0 2px 10px rgba(0,0,0,1), 0 0 5px rgba(0,0,0,1)',
            }}
          >
            Нажмите руны стихий в правильной последовательности
          </p>
        </div>
      )}

      {/* Progress indicators - top-left below back button */}
      <div className="fixed top-4 left-4 flex gap-2 z-10">
        {[0, 1, 2, 3].map((index) => {
          const hasRune = sequence[index] !== undefined;
          return (
            <div
              key={index}
              className="w-8 h-8 rounded-full transition-all duration-300"
              style={{
                background: hasRune
                  ? failed
                    ? 'radial-gradient(circle, rgba(255, 100, 100, 0.5) 0%, rgba(200, 60, 60, 0.3) 100%)'
                    : 'radial-gradient(circle, rgba(255, 180, 100, 0.5) 0%, rgba(200, 140, 80, 0.3) 100%)'
                  : 'rgba(80, 70, 60, 0.3)',
                border: hasRune ? '2px solid rgba(255, 180, 100, 0.6)' : '1px solid rgba(120, 100, 80, 0.4)',
                boxShadow: hasRune ? '0 0 10px rgba(255, 180, 100, 0.4)' : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Reset button - top-right corner */}
      {!solved && sequence.length > 0 && !doorOpening && (
        <button
          onClick={() => setSequence([])}
          className="fixed top-4 right-4 px-4 py-2 rounded transition-all duration-300 z-10 text-sm font-medium"
          style={{
            background: 'rgba(60, 50, 40, 0.85)',
            border: '2px solid rgba(140, 110, 80, 0.6)',
            color: 'rgba(220, 200, 180, 0.95)',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          Сбросить
        </button>
      )}

      {/* Failure overlay - red vignette */}
      {failed && (
        <div
          className="fixed inset-0 pointer-events-none z-30"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(180, 40, 40, 0.5) 100%)',
            animation: 'pulse 0.8s ease-out',
          }}
        />
      )}

      {/* Door opening - amber crack */}
      {doorOpening && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
          <div
            className="w-1 h-full animate-pulse"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 180, 100, 0.8) 20%, rgba(255, 180, 100, 1) 50%, rgba(255, 180, 100, 0.8) 80%, transparent 100%)',
              boxShadow: '0 0 50px 25px rgba(255, 180, 100, 0.6)',
              filter: 'blur(4px)',
            }}
          />
        </div>
      )}

      {/* Success modal */}
      {solved && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40">
          <div
            className="max-w-lg mx-4 p-8 rounded-lg text-center space-y-4"
            style={{
              background: 'rgba(35, 30, 25, 0.95)',
              border: '2px solid rgba(200, 160, 120, 0.5)',
              boxShadow: '0 10px 60px rgba(0,0,0,0.9)',
            }}
          >
            <div
              className="text-6xl mb-4"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(255, 180, 100, 0.7))',
              }}
            >
              ✦
            </div>
            <h3
              className="text-3xl md:text-4xl font-serif mb-3"
              style={{
                color: 'rgba(230, 190, 150, 0.95)',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              Дверь открыта
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{
                color: 'rgba(210, 190, 170, 0.9)',
              }}
            >
              Древний камень отступает, открывая проход в глубины горы.
              Тёплый воздух несёт запах земли и забытых веков.
            </p>
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded text-base font-medium transition-all"
              style={{
                background: 'rgba(120, 90, 60, 0.9)',
                border: '2px solid rgba(180, 150, 120, 0.6)',
                color: 'rgba(240, 220, 200, 0.95)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              }}
            >
              Закрыть проход
            </button>
          </div>
        </div>
      )}

      {/* Opening message */}
      {doorOpening && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
          <p
            className="text-xl md:text-2xl font-serif animate-pulse px-8 py-4 rounded"
            style={{
              background: 'rgba(40, 35, 30, 0.9)',
              border: '2px solid rgba(180, 140, 100, 0.5)',
              color: 'rgba(230, 200, 170, 0.95)',
              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            }}
          >
            Руны светятся...
          </p>
        </div>
      )}
    </div>
  );
}
