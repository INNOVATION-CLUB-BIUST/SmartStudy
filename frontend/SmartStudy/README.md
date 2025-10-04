# SMART-STUDY
A Notion-inspired academic productivity web application designed for university students to manage assignments, exams, and study schedules with AI-powered personalized study plans.

## Features

- **AI-Powered Study Planning**: Automatically generate personalized study schedules
- **Comprehensive Onboarding**: 6-step setup process to capture academic profile and preferences
- **Interactive Study Mode**: Focus tools with timers and productivity techniques
- **Analytics Dashboard**: Track study progress and performance patterns
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Routing**: React Router
- **Data Persistence**: localStorage

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components (Header, Sidebar, etc.)
├── pages/              # Page components
├── services/           # Business logic and API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── context/            # React Context providers
```

## Development Status

This project is currently in development. The foundation has been set up with:

- ✅ React 18 + TypeScript project structure
- ✅ TailwindCSS configuration
- ✅ Basic routing with React Router
- ✅ Component architecture and layout
- ✅ Service layer foundation
- ✅ TypeScript interfaces and types
- ✅ Utility functions

## Next Steps

Refer to the implementation plan in `.kiro/specs/study-planner-web-app/tasks.md` for detailed development tasks.

## License

This project is part of a development specification and is not yet licensed for public use.
