# Homework Planner

A React + TypeScript homework planning app with Tailwind CSS v4.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS v4** with custom navy/cream theme
- **date-fns** for date handling
- **lucide-react** for icons
- **Radix UI** for accessible components

## Features

- Dashboard with assignment list and priority gauges
- Assignment form with inline calendar and stress levels
- Weekly schedule view (12 PM - 5 PM time slots)
- Self care tips page
- Local storage persistence
- Responsive design

## Project Structure

```
src/
├── components/          # React components
├── context/            # React Context for shared state
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles with Tailwind
```