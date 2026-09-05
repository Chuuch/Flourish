Project Structure
-----------------

src/
├── app/ # Application initialization (Router, Providers, Layouts)
│ ├── layouts/ # Root, Auth, Dashboard shell layouts
│ ├── providers/ # Combined context providers
│ └── router/ # Route definitions with code-splitting
├── components/ # Truly shared UI (Design System / primitives)
│ ├── ui/ # Buttons, Inputs, Modals, Spinners
│ └── feedback/ # Error boundaries, Skeleton loaders
├── config/ # App-wide runtime configuration & validation
├── features/ # Business domains (self-contained modules)
│ ├── home/
│ └── users/
│ ├── api/ # TanStack Queries/Mutations specific to users
│ ├── components/ # Feature-scoped UI (e.g., UserCard, UserList)
│ ├── hooks/ # Feature-scoped logic
│ ├── pages/ # Route entry points for this feature
│ ├── schemas/ # Zod validation schemas
│ ├── types/ # Feature TypeScript interfaces
│ └── index.ts # Public API for the feature (exports only what's needed)
├── hooks/ # Global reusable hooks (useDebounce, useMediaQuery)
├── lib/ # External library instantiations
│ ├── api/ # Axios client instance, interceptors, error mapping
│ └── logger/ # Structured client logger (Sentry, LogRocket, console wrapper)
├── store/ # Global client state (Zustand) — keep feature state inside features
└── types/ # Global generic TypeScript types (e.g., API response wrappers)
