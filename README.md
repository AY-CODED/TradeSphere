# TradeSphere

TradeSphere is a React application built with Vite.

## Project structure

```text
src/
├── api/                  # API calls and related configuration
├── assets/               # Images, fonts, and other static files
├── components/
│   ├── layout/           # Shared page layout components
│   └── ui/               # Reusable UI components
├── context/              # Global React Context state
├── data/                 # Product catalog and mock data
├── hooks/                # Reusable hooks, including useTheme
├── pages/                # Application pages and route definitions
├── redux/                # Reserved for Redux state if introduced
├── services/             # External service integrations
├── utils/                # Shared utility functions
├── App.jsx
├── index.css
└── main.jsx              # Vite application entry point
```

The app uses React Context for cart state and does not currently require Redux or external API services.

## Theme

`useTheme()` provides `theme`, `setTheme`, and `toggleTheme` to components inside the app. The selected light or dark theme is saved in local storage; first-time visitors inherit their system preference. Shared color tokens are defined at the top of `src/index.css`, including `--brand-600`, `--brand-700`, and `--brand-800`.

## Commands

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` previews the production build.
