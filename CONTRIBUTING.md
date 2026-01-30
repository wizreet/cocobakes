# Contributing to CocoBakes

Thank you for your interest in contributing to CocoBakes! This document provides guidelines and best practices for maintaining code quality and consistency.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Code Architecture](#code-architecture)
- [Component Guidelines](#component-guidelines)
- [Performance Guidelines](#performance-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Security Guidelines](#security-guidelines)
- [Git Workflow](#git-workflow)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+ (preferred) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/wizreet/cocobakes.git

# Navigate to the project
cd cocobakes/astro-bakery

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Development Commands

```bash
pnpm dev          # Start dev server at localhost:4321
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint errors
pnpm astro check  # Run TypeScript checks
```

## 🏗️ Code Architecture

### Directory Structure

```
src/
├── assets/       # Images and static assets
├── components/   # UI components (Astro + React)
├── config/       # Environment and app configuration
├── constants/    # Application-wide constants
├── data/         # Static data files
├── features/     # Feature-specific business logic
├── hooks/        # Custom React hooks
├── layouts/      # Page layouts
├── pages/        # Route pages
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
```

### Import Aliases

Always use path aliases for cleaner imports:

```typescript
// ✅ Good
import { Button } from '@/components/react';
import { useToggle } from '@/hooks';
import { ICONS } from '@/constants';
import type { MenuItem } from '@/types';

// ❌ Bad
import { Button } from '../../../components/react';
import { useToggle } from '../../../hooks';
```

### File Naming Conventions

| Type             | Convention                  | Example                   |
| ---------------- | --------------------------- | ------------------------- |
| Components       | PascalCase                  | `MenuCard.tsx`            |
| Hooks            | camelCase with `use` prefix | `useDebounce.ts`          |
| Utilities        | camelCase                   | `validation.ts`           |
| Constants        | SCREAMING_SNAKE_CASE        | `API_ENDPOINTS`           |
| Types/Interfaces | PascalCase                  | `MenuItem`, `ButtonProps` |

## 🧩 Component Guidelines

### Component Structure

Follow this order in every component:

```tsx
/**
 * Brief description of the component
 * @example
 * <ComponentName prop="value" />
 */

// 1. External imports
import { memo, useState, useMemo, useCallback } from 'react';
import { cx } from 'class-variance-authority';

// 2. Internal imports (aliases)
import { useToggle } from '@/hooks';
import { ICONS } from '@/constants';
import type { ComponentProps } from '@/types';

// 3. Types/Interfaces (if not imported)
interface LocalProps {
  /** Description of the prop */
  propName: string;
}

// 4. Constants (component-specific)
const ANIMATION_DURATION = 200;

// 5. Sub-components (memoized)
const SubComponent = memo(function SubComponent({ prop }: SubProps) {
  return <div>{prop}</div>;
});
SubComponent.displayName = 'SubComponent';

// 6. Main component
export const ComponentName = memo(function ComponentName({
  propName,
}: LocalProps) {
  // Hooks first
  const [state, setState] = useState(false);

  // Memoized values
  const computedValue = useMemo(() => {
    return expensiveComputation(propName);
  }, [propName]);

  // Callbacks
  const handleClick = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  // Render
  return <div onClick={handleClick}>{computedValue}</div>;
});

// 7. Display name for debugging
ComponentName.displayName = 'ComponentName';

// 8. Default export (optional)
export default ComponentName;
```

### Memoization Rules

1. **Always use `React.memo()`** for components that:
   - Receive complex props (objects, arrays)
   - Have expensive renders
   - Are rendered in lists

2. **Use `useMemo()`** for:
   - Expensive calculations
   - Objects/arrays passed to child components
   - Filtered/transformed data

3. **Use `useCallback()`** for:
   - Event handlers passed to memoized children
   - Functions used in dependency arrays

```tsx
// ✅ Good - memoized card in a list
const MenuCard = memo(function MenuCard({ item }: MenuCardProps) {
  return <div>{item.name}</div>;
});

// Parent component
function MenuList({ items }: { items: MenuItem[] }) {
  const handleSelect = useCallback((id: string) => {
    console.log('Selected:', id);
  }, []);

  return items.map((item) => (
    <MenuCard key={item.id} item={item} onSelect={handleSelect} />
  ));
}
```

### Accessibility Requirements

Every interactive component must have:

- `aria-label` or visible text
- Keyboard support (`onKeyDown` for Enter/Space)
- Focus indicators (via Tailwind `focus:` variants)
- Proper semantic HTML elements

```tsx
// ✅ Good
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  aria-label="Close dialog"
  className="focus:ring-2 focus:ring-brand focus:outline-none"
>
  <Icon icon="heroicons:x-mark" aria-hidden="true" />
</button>

// ❌ Bad - no aria-label, no keyboard support
<div onClick={handleClick}>
  <Icon icon="heroicons:x-mark" />
</div>
```

## ⚡ Performance Guidelines

### Core Web Vitals Targets

| Metric | Target  | Description              |
| ------ | ------- | ------------------------ |
| LCP    | < 2.5s  | Largest Contentful Paint |
| FID    | < 100ms | First Input Delay        |
| CLS    | < 0.1   | Cumulative Layout Shift  |
| TTFB   | < 600ms | Time to First Byte       |

### Image Optimization

1. **Always use lazy loading** for below-fold images:

   ```tsx
   <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
   ```

2. **Use priority hints** for hero images:

   ```tsx
   <img src={heroImage.src} alt="Hero" loading="eager" fetchpriority="high" />
   ```

3. **Provide dimensions** to prevent layout shift:
   ```tsx
   <img src={image.src} width={800} height={600} alt="Description" />
   ```

### Bundle Size

- Keep component imports specific, not barrel imports
- Use dynamic imports for heavy libraries
- Monitor bundle size in build output

```tsx
// ✅ Good - specific import
import { Icon } from '@iconify/react';

// ✅ Good - dynamic import for heavy component
const HeavyChart = lazy(() => import('./HeavyChart'));
```

### Event Handler Optimization

```tsx
// ✅ Good - throttled scroll handler
const handleScroll = useMemo(
  () =>
    rafThrottle(() => {
      setScrollY(window.scrollY);
    }),
  [],
);

// ✅ Good - debounced search
const debouncedSearch = useDebounce(searchQuery, 300);
```

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, verify:

- [ ] All pages load without errors
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Keyboard navigation works
- [ ] Forms submit correctly
- [ ] Links open correctly (internal/external)
- [ ] Images load with proper alt text
- [ ] No console errors or warnings

### Lighthouse Audit

Run Lighthouse in Chrome DevTools and ensure:

- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 🔒 Security Guidelines

### Input Handling

Always sanitize user inputs:

```typescript
import { sanitizeInput, isValidEmail } from '@/utils/validation';

// ✅ Good
const handleSubmit = (formData: FormData) => {
  const email = sanitizeInput(formData.get('email') as string);

  if (!isValidEmail(email)) {
    setError('Invalid email');
    return;
  }

  // Process sanitized input
};
```

### External Links

Always use `rel="noopener noreferrer"` for external links:

```tsx
// ✅ Good
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

### Sensitive Data

- Never commit API keys or secrets
- Use environment variables for configuration
- Never log sensitive user data

## 📝 Git Workflow

### Branch Naming

```
feature/add-menu-filtering
fix/contact-form-validation
refactor/optimize-image-loading
docs/update-readme
```

### Commit Messages

Follow conventional commits:

```
feat: add brownie builder price calculator
fix: resolve contact form submission error
perf: optimize image lazy loading
refactor: extract menu card into separate component
docs: update contributing guidelines
style: format code with prettier
test: add menu filtering tests
chore: update dependencies
```

### Pull Request Checklist

- [ ] Code follows project conventions
- [ ] No TypeScript errors (`pnpm astro check`)
- [ ] No lint errors (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Updated documentation if needed
- [ ] Added meaningful commit messages

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Getting Help

If you have questions:

1. Check existing documentation
2. Search closed issues
3. Open a new issue with details

Thank you for contributing! 🎂
