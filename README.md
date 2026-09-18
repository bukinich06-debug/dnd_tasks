# Puzzle Arena / Арена Головоломок

An interactive web app featuring engaging brain-teaser puzzles built with Next.js, TypeScript, and Tailwind CSS. UI text in Russian, code in English.

## Features / Особенности

- **Interactive Puzzles / Интерактивные головоломки**: Solve challenges directly in your browser with intuitive drag-and-drop and click interfaces
- **Progress Tracking / Отслеживание прогресса**: Your solved puzzles are automatically saved locally (no login required)
- **Mobile-Friendly / Мобильная версия**: Responsive design works great on phones, tablets, and desktops
- **Four Starter Puzzles / Четыре головоломки**:
  - 🏰 **Тайная дверь (Secret Door)** - D&D-themed adventure puzzle: unlock a secret passage by arranging elemental runes in the correct sequence
  - 🔢 **Цветовая последовательность (Color Sequence)**: Arrange colors in rainbow order using drag-and-drop
  - 🧩 **Числовые пары (Number Pairs)**: Match numbers with their corresponding words
  - 💡 **Огни (Lights Out)**: Turn off all lights by toggling strategically

## Flagship Puzzle: Secret Door

The **Secret Door** puzzle sets a D&D atmosphere where adventurers discover a hidden passage in a cave. Players must arrange four elemental runes (Earth, Air, Water, Fire) in the correct sequence based on an ancient riddle. Features:
- Immersive cave/dungeon atmosphere with stone textures
- Interactive rune stones that light up when pressed
- Visual sequence tracker
- Animated door opening effect on success
- Clear failure feedback with automatic reset
- Russian flavor text and hints

## Getting Started / Начало работы

### Prerequisites

- Node.js 18+ or compatible package manager (npm, pnpm, yarn, or bun)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dnd_tasks
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start solving puzzles!

### Production Build

Build the app for production:

```bash
npm run build
npm start
```

## Tech Stack / Технологический стек

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks with local storage
- **Fonts**: Geist Sans & Geist Mono

## Project Structure / Структура проекта

```
.
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page with puzzle catalog (Russian UI)
│   └── puzzles/
│       └── [id]/
│           └── page.tsx    # Dynamic puzzle solve page
├── components/
│   └── puzzles/
│       ├── SecretDoorPuzzle.tsx       # D&D themed rune puzzle (FLAGSHIP)
│       ├── ColorSequencePuzzle.tsx    # Drag-and-drop sequence puzzle
│       ├── NumberPairsPuzzle.tsx      # Matching puzzle
│       └── LightsOutPuzzle.tsx        # Logic grid puzzle
├── lib/
│   ├── puzzles.ts          # Puzzle data and types
│   └── progress.ts         # Local storage utilities
└── public/                 # Static assets
```

## How It Works / Как это работает

### Puzzles

Each puzzle is a self-contained React component with:
- Clear instructions and goals (in Russian)
- Interactive UI (drag-and-drop, clicks, toggles)
- Real-time validation
- Success feedback with animations
- Reset/replay functionality

### Progress Tracking

Puzzle completion is tracked using browser `localStorage`:
- No account or authentication required
- Progress persists across sessions
- Solved puzzles are marked with a checkmark on the home page
- Track your completion stats

### Adding New Puzzles

1. Create a new puzzle component in `components/puzzles/`
2. Add puzzle metadata to `lib/puzzles.ts` (with Russian title/description)
3. Register the component in `app/puzzles/[id]/page.tsx`
4. Include the puzzle ID in `generateStaticParams()`

## Language Note / Примечание о языке

- **UI Text**: Russian (titles, descriptions, instructions, buttons)
- **Code**: English (variable names, comments, technical docs)
- **Target Audience**: Russian-speaking users

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome for Android)
- Requires JavaScript and localStorage support

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests with new puzzles, improvements, or bug fixes.
