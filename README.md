# CocoBakes - Bakery Website

A modern, accessible, and performant bakery website built with Astro, React, and Tailwind CSS.

## 🚀 Project Structure

```
src/
├── assets/           # Static images and assets
├── components/       # UI Components
│   ├── react/        # React components (interactive)
│   └── *.astro       # Astro components (static)
├── config/           # Environment and app configuration
├── constants/        # Application-wide constants
├── data/             # Static data (menu items, testimonials, etc.)
├── features/         # Feature-specific logic
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
├── pages/            # Page routes
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
    ├── index.ts      # Main utilities export
    ├── validation.ts # Input validation & sanitization
    ├── security.ts   # Security utilities (rate limiting, CSRF)
    ├── logger.ts     # Structured logging with performance tracking
    └── performance.ts # Web Vitals, lazy loading, optimization
```

## 🏗️ Architecture Decisions

### TypeScript Best Practices

- **Centralized Types**: All types in `src/types/index.ts`
- **Strict Mode**: Full TypeScript strict mode enabled
- **Readonly Types**: Data structures use `readonly` to prevent mutation
- **Type Guards**: Runtime type checking for external data

### Component Design

- **Composition over Inheritance**: Components are composed, not extended
- **Single Responsibility**: Each component does one thing well
- **Memoization**: `React.memo()` used for expensive renders (MenuCard, GalleryThumbnail)
- **Error Boundaries**: Graceful error handling with fallback UI

### Custom Hooks

Located in `src/hooks/`:

- `useScrollEffect` - Header scroll animations with RAF throttling
- `useBodyScrollLock` - Modal/menu scroll locking
- `useToggle` - Boolean state management
- `useDebounce` - Value debouncing
- `useLocalStorage` - Persistent state with SSR safety
- `useMediaQuery` - Responsive breakpoints (useIsDesktop, useIsMobile)
- `usePriceCalculation` - Memoized price computations
- `useFormSubmission` - Form state management
- `useClickOutside` - Click outside detection
- `useKeyPress` - Keyboard event handling

### Constants & Configuration

- **Constants**: `src/constants/index.ts` - Business info, URLs, icons, validation rules
- **Environment**: `src/config/env.ts` - Environment variables with type safety
- **Validation**: `src/utils/validation.ts` - Input validation rules

## ⚡ Performance Optimizations

### Build Optimization

- **Code Splitting**: Manual chunks for React and UI vendor libraries
- **Tree Shaking**: Unused code eliminated during build
- **CSS Code Split**: Styles are split per-page
- **HTML Compression**: Enabled via `compressHTML: true`
- **Asset Hashing**: Cache-busting with content hashes

### Runtime Performance

- **Web Vitals Tracking**: LCP, FCP, CLS, TTFB monitoring (`src/utils/performance.ts`)
- **Lazy Loading**: Images and components load on demand
- **Intersection Observer**: Efficient viewport detection
- **RAF Throttling**: Scroll handlers use requestAnimationFrame
- **Debouncing**: Search and input handlers are debounced
- **Memoization**: `useMemo`, `useCallback`, `React.memo` used throughout

### Progressive Web App (PWA)

- **Service Worker**: Offline support with caching strategies (`public/sw.js`)
- **Web App Manifest**: Installable PWA (`public/manifest.json`)
- **Cache First**: Static assets cached for fast loads
- **Network First**: Navigation requests fetch fresh content
- **Stale While Revalidate**: Background cache updates

### Image Optimization

- **Lazy Loading**: Native `loading="lazy"` attribute
- **Priority Hints**: `fetchpriority="high"` for hero images
- **Async Decoding**: `decoding="async"` to prevent blocking
- **OptimizedImage Component**: Custom component with blur placeholder

## 🔒 Security Features

### Input Security

1. **Input Sanitization**: All user inputs sanitized via `sanitizeInput()`
2. **XSS Prevention**: HTML entities escaped, dangerous patterns removed
3. **Input Length Limits**: Prevent oversized payloads
4. **Email/Phone Validation**: Regex-based validation

### Rate Limiting

- Contact form limited to 3 submissions per 5 minutes
- In-memory rate limiting with configurable thresholds

### Form Security

- **CSRF Tokens**: Generate and validate CSRF tokens
- **Honeypot Fields**: Detect bot submissions
- **Trusted Domains**: Validate redirect URLs

### Security Headers (via meta tags)

- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## ♿ Accessibility

- **Skip Links**: Main content skip link for keyboard users
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Focus Indicators**: Visible focus states
- **Semantic HTML**: Proper use of `<nav>`, `<main>`, `<section>`, etc.
- **Alt Text**: All images have descriptive alt text
- **Form Labels**: All form inputs have associated labels

## 🎨 Styling

- **Tailwind CSS**: Utility-first styling with JIT compilation
- **CVA**: Class Variance Authority for component variants
- **Design Tokens**: Centralized color and spacing values
- **Dark Mode Ready**: CSS variables for theming
- **Hover Optimization**: `hoverOnlyWhenSupported` for touch devices

## 📦 Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm astro check

# Lint code
pnpm lint

# Fix lint errors
pnpm lint:fix
```

## 🧪 Code Quality

- **ESLint**: Code linting with TypeScript and React rules
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 📝 Coding Standards

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Types: `PascalCase` for interfaces, `camelCase` for type aliases

### Component Structure

```tsx
/**
 * Component description
 */

// Imports (external, then internal)
import { memo } from 'react';
import { cx } from 'class-variance-authority';

// Types
interface ComponentProps {
  // ...
}

// Constants (if any)
const SOME_CONSTANT = 'value';

// Component
export const Component = memo(function Component(props: ComponentProps) {
  // Hooks
  // Event handlers
  // Render
});

export default Component;
```

### Error Handling

- Use `ErrorBoundary` for React component trees
- Use `logError()` from config for error logging
- Always provide user-friendly error messages

## 🚀 Deployment

The site is configured for GitHub Pages deployment:

- Base URL: `/cocobakes/`
- Site URL: `https://wizreet.github.io`

## 📄 License

All rights reserved. © 2026 CocoBakes
