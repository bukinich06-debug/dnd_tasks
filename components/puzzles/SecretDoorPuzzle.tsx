'use client';

import { useState, useRef, useEffect } from 'react';
import { markPuzzleSolved } from '@/lib/progress';
import Image from 'next/image';
import Link from 'next/link';

// Rune positions relative to the actual image dimensions (percentages of the image, not viewport)
// These are positioned on the carved runes in the center of the scene.png
const RUNES = [
  { id: 3, name: 'Земля', element: 'earth', position: { top: 0.42, left: 0.42 } },  // Top-left rune (Earth)
  { id: 1, name: 'Воздух', element: 'air', position: { top: 0.42, left: 0.58 } },   // Top-right rune (Air)
  { id: 4, name: 'Вода', element: 'water', position: { top: 0.58, left: 0.42 } },   // Bottom-left rune (Water)
  { id: 2, name: 'Огонь', element: 'fire', position: { top: 0.58, left: 0.58 } },   // Bottom-right rune (Fire)
];

const CORRECT_SEQUENCE = [3, 1, 4, 2]; // Earth, Air, Water, Fire

interface ImageBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function SecretDoorPuzzle() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [doorOpening, setDoorOpening] = useState(false);
  const [hoveredRune, setHoveredRune] = useState<number | null>(null);
  const [imageBounds, setImageBounds] = useState<ImageBounds | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Calculate the actual rendered image bounds (accounting for object-cover)
  useEffect(() => {
    const calculateImageBounds = () => {
      if (!imageRef.current) return;

      const container = imageRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Image natural dimensions: 2532 × 1878 (4:3 aspect ratio approximately)
      const imageAspect = 2532 / 1878;
      const containerAspect = containerRect.width / containerRect.height;

      let bounds: ImageBounds;

      if (containerAspect > imageAspect) {
        // Container is wider - image fills height, crops width
        const renderedWidth = containerRect.height * imageAspect;
        bounds = {
          x: (containerRect.width - renderedWidth) / 2,
          y: 0,
          width: renderedWidth,
          height: containerRect.height,
        };
      } else {
        // Container is taller - image fills width, crops height
        const renderedHeight = containerRect.width / imageAspect;
        bounds = {
          x: 0,
          y: (containerRect.height - renderedHeight) / 2,
          width: containerRect.width,
          height: renderedHeight,
        };
      }

      setImageBounds(bounds);
    };

    calculateImageBounds();
    
    const resizeObserver = new ResizeObserver(calculateImageBounds);
    if (imageRef.current) {
      resizeObserver.observe(imageRef.current);
    }

    window.addEventListener('resize', calculateImageBounds);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateImageBounds);
    };
  }, []);

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

  // Convert rune position from image-relative to viewport-absolute
  const getRunePosition = (rune: typeof RUNES[0]) => {
    if (!imageBounds) return null;
    
    return {
      left: imageBounds.x + rune.position.left * imageBounds.width,
      top: imageBounds.y + rune.position.top * imageBounds.height,
    };
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden">
      {/* Fullscreen background image - object-cover fills viewport */}
      <div ref={imageRef} className="absolute inset-0 w-full h-full">
        <Image
          src="/puzzles/secret-door/scene.png"
          alt="Secret cave door"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      {/* Back button - top-left corner */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 px-4 py-2 rounded transition-all duration-300 text-sm font-medium"
        style={{
          background: 'rgba(60, 50, 40, 0.85)',
          border: '2px solid rgba(140, 110, 80, 0.6)',
          color: 'rgba(220, 200, 180, 0.95)',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        ← Назад
      </Link>

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

      {/* Clickable hotspots - positioned on the carved runes using actual image bounds */}
      {imageBounds && RUNES.map((rune) => {
        const order = getRuneOrder(rune.id);
        const isInSequence = order !== null;
        const isHovered = hoveredRune === rune.id;
        const isClickable = !solved && !doorOpening && sequence.length < 4;
        const position = getRunePosition(rune);

        if (!position) return null;

        // Calculate hotspot size based on image size (responsive)
        const hotspotSize = Math.min(imageBounds.width, imageBounds.height) * 0.1;

        return (
          <button
            key={rune.id}
            onClick={() => handleRuneClick(rune.id)}
            onMouseEnter={() => setHoveredRune(rune.id)}
            onMouseLeave={() => setHoveredRune(null)}
            disabled={!isClickable}
            className="fixed z-20 cursor-pointer transition-all duration-200"
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
              width: `${hotspotSize}px`,
              height: `${hotspotSize}px`,
              transform: 'translate(-50%, -50%)',
            }}
            title={rune.name}
          >
            {/* VISIBLE stone ring outline - shows what's clickable */}
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

            {/* Order number - shows which rune was pressed in sequence */}
            {order !== null && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  fontSize: `${hotspotSize * 0.5}px`,
                  fontWeight: 'bold',
                  color: 'rgba(255, 220, 180, 0.95)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(255, 180, 100, 0.6)',
                }}
              >
                {order}
              </div>
            )}

            {/* Hover glow for clickable runes */}
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

      {/* Progress indicators - top-left below back button */}
      <div className="fixed top-20 left-4 flex gap-2 z-10">
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
