# Puzzle Arena

An interactive web app featuring engaging brain-teaser puzzles built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Interactive Puzzles**: Solve challenges directly in your browser with intuitive drag-and-drop and click interfaces
- **Progress Tracking**: Your solved puzzles are automatically saved locally (no login required)
- **Mobile-Friendly**: Responsive design works great on phones, tablets, and desktops
- **Three Starter Puzzles**:
  - 🔢 **Color Sequence**: Arrange colors in rainbow order using drag-and-drop
  - 🧩 **Number Pairs**: Match numbers with their corresponding words
  - 💡 **Lights Out**: Turn off all lights by toggling strategically

## Getting Started

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

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks with local storage
- **Fonts**: Geist Sans & Geist Mono

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page with puzzle catalog
│   └── puzzles/
│       └── [id]/
│           └── page.tsx    # Dynamic puzzle solve page
├── components/
│   └── puzzles/
│       ├── ColorSequencePuzzle.tsx    # Drag-and-drop sequence puzzle
│       ├── NumberPairsPuzzle.tsx      # Matching puzzle
│       └── LightsOutPuzzle.tsx        # Logic grid puzzle
├── lib/
│   ├── puzzles.ts          # Puzzle data and types
│   └── progress.ts         # Local storage utilities
└── public/                 # Static assets
```

## How It Works

### Puzzles

Each puzzle is a self-contained React component with:
- Clear instructions and goals
- Interactive UI (drag-and-drop, clicks, toggles)
- Real-time validation
- Success feedback with confetti and stats
- Reset/replay functionality

### Progress Tracking

Puzzle completion is tracked using browser `localStorage`:
- No account or authentication required
- Progress persists across sessions
- Solved puzzles are marked with a checkmark on the home page
- Track your completion stats

### Adding New Puzzles

1. Create a new puzzle component in `components/puzzles/`
2. Add puzzle metadata to `lib/puzzles.ts`
3. Register the component in `app/puzzles/[id]/page.tsx`
4. Include the puzzle ID in `generateStaticParams()`

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome for Android)
- Requires JavaScript and localStorage support

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests with new puzzles, improvements, or bug fixes.
