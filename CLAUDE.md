# Development Commands

- `npm run dev`: Start development server with HTTPS
- `npm run build`: Build production-ready code (TypeScript compile + Vite build)
- `npm run lint`: Run ESLint on all files
- `npm run preview`: Preview production build locally
- `npm run start`: Serve production build

# Code Style Guidelines

- **Formatting**: Single quotes for strings, tabs for indentation
- **TypeScript**: Strict mode enabled, interface-based typing for objects
- **Naming**: Use PascalCase for components, interfaces, and types; camelCase for variables
- **Component Structure**: Functional components with React hooks
- **State Management**: Zustand for global state, React Query for API data
- **Styling**: Tailwind CSS with custom plugins when needed
- **Error Handling**: Proper try/catch blocks for async operations
- **Imports**: Group by external libs first, then internal modules
- **Module System**: Use ESM (import/export) exclusively
- **React Best Practices**: Follow React hooks rules, use memo/callbacks for optimization