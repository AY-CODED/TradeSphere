# TradeSphere

TradeSphere is a React application built with Vite.

## Project structure

```text
src/
├── app/                  # Application setup, routes, layout, and providers
│   ├── routes/
│   ├── App.jsx
│   ├── layout.jsx
│   ├── providers.jsx
│   └── styles.css
├── features/             # Self-contained product domains
│   ├── account/          # Buyer profile and business verification
│   ├── cart/
│   ├── checkout/
│   ├── marketplace/
│   └── orders/
├── shared/               # Reusable components and shared assets
│   ├── assets/
│   └── components/
└── main.jsx              # Vite application entry point
```

Feature-specific pages, hooks, context, and data live alongside their feature. Shared UI and application-wide setup live outside the feature modules.

## Commands

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` previews the production build.
