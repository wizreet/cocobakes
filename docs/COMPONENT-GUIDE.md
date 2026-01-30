# Component Guide

This guide explains how to create, modify, and organize components in the CocoBakes codebase.

## 🏗️ Component Types

### Astro Components (`.astro`)

Used for:

- Static content
- Page layouts
- SEO/meta tags
- Content that doesn't need interactivity

```astro
---
// Server-side code (runs at build time)
import { ButtonLink } from '@/components/react';
const title = 'Hello World';
---

<!-- Template (HTML with special syntax) -->
<div>
  <h1>{title}</h1>
  <ButtonLink href="/menu">View Menu</ButtonLink>
</div>

<style>
  /* Scoped styles */
  h1 {
    color: brown;
  }
</style>
```

### React Components (`.tsx`)

Used for:

- Interactive elements
- State management
- Event handling
- Animations

```tsx
import { memo, useState, useCallback } from 'react';
import { cx } from 'class-variance-authority';

interface ButtonProps {
  readonly label: string;
  readonly onClick: () => void;
}

export const Button = memo(function Button({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="bg-fill-brand px-4 py-2">
      {label}
    </button>
  );
});
Button.displayName = 'Button';
```

## 📁 File Organization

```
src/components/
├── react/                  # React components
│   ├── index.ts           # Re-exports all components
│   ├── Button.tsx
│   ├── Header.tsx
│   └── ...
└── *.astro                # Astro components
    ├── PageHeader.astro
    ├── Footer.astro
    └── ...
```

## 📝 Component Template

### React Component Template

```tsx
/**
 * ComponentName
 * Brief description of what this component does
 */

import { memo, useState, useMemo, useCallback } from 'react';
import { cx } from 'class-variance-authority';
import { Icon } from '@iconify/react';

// ============================================================================
// Types
// ============================================================================

interface ComponentNameProps {
  /** Description of this prop */
  readonly title: string;
  /** Optional prop with default */
  readonly variant?: 'primary' | 'secondary';
  /** Children if needed */
  readonly children?: React.ReactNode;
}

// ============================================================================
// Constants
// ============================================================================

const ANIMATION_DURATION = 200;

// ============================================================================
// Sub-components (if needed)
// ============================================================================

const SubItem = memo(function SubItem({ text }: { text: string }) {
  return <span>{text}</span>;
});
SubItem.displayName = 'SubItem';

// ============================================================================
// Main Component
// ============================================================================

export const ComponentName = memo(function ComponentName({
  title,
  variant = 'primary',
  children,
}: ComponentNameProps) {
  // State
  const [isOpen, setIsOpen] = useState(false);

  // Derived state
  const classes = useMemo(
    () =>
      cx(
        'base-classes',
        variant === 'primary' && 'primary-classes',
        variant === 'secondary' && 'secondary-classes',
      ),
    [variant],
  );

  // Handlers
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Render
  return (
    <div className={classes}>
      <h2>{title}</h2>
      <button onClick={handleToggle}>Toggle</button>
      {isOpen && children}
    </div>
  );
});

ComponentName.displayName = 'ComponentName';

export default ComponentName;
```

## 🔄 Using React in Astro

### Client Directives

```astro
---
import { Button } from '@/components/react';
---

<!-- Load immediately -->
<Button client:load />

<!-- Load when visible -->
<Button client:visible />

<!-- Load when idle -->
<Button client:idle />

<!-- Load on media query -->
<Button client:media="(max-width: 768px)" />

<!-- No hydration (static) -->
<Button />
```

### Passing Data to React

```astro
---
import { MenuPage } from '@/components/react';
import menuItems from '@/data/menu-items';
---

<MenuPage items={menuItems} client:load />
```

## 🎨 Styling Components

### Using Tailwind

```tsx
// Direct classes
<div className="bg-fill-brand text-white px-4 py-2 rounded-lg">

// Conditional classes with cx
import { cx } from 'class-variance-authority';

<div className={cx(
  'base-class',
  isActive && 'active-class',
  size === 'large' && 'large-class',
)}>
```

### Component Variants with CVA

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonStyles = cva(
  // Base styles
  'rounded-lg font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-fill-brand hover:bg-fill-brand-hover text-white',
        secondary: 'bg-surface text-brand border-brand border',
      },
      size: {
        small: 'px-3 py-1 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  },
);

type ButtonProps = VariantProps<typeof buttonStyles> & {
  children: React.ReactNode;
};

export function Button({ variant, size, children }: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size })}>{children}</button>
  );
}
```

## ♿ Accessibility Requirements

### Every Interactive Element Needs:

```tsx
<button
  // 1. Accessible name
  aria-label="Close dialog"
  // 2. Keyboard support
  onKeyDown={(e) => e.key === 'Enter' && handleAction()}
  // 3. Focus indicator
  className="focus:ring-brand focus:outline-none focus:ring-2"
  // 4. Proper role (if not semantic)
  role="button"
>
  <Icon icon="heroicons:x-mark" aria-hidden="true" />
</button>
```

### Forms

```tsx
<label htmlFor="email" className="block">
  Email Address
</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email
  </span>
)}
```

## 🧪 Testing Components

### Manual Testing Checklist

- [ ] Renders without errors
- [ ] Props work as expected
- [ ] State changes correctly
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Responsive on mobile
- [ ] No console errors/warnings

### Testing Locally

```bash
# Start dev server
pnpm dev

# Navigate to component page
# Test all interactions
# Check browser console for errors
```

## 📦 Exporting Components

### Add to Index

After creating a component, export from `src/components/react/index.ts`:

```typescript
// Existing exports
export { Button } from './Button';
export { Header } from './Header';

// Add new component
export { NewComponent } from './NewComponent';
```

### Usage

```tsx
// Clean import
import { Button, Header, NewComponent } from '@/components/react';
```

## 🔍 Common Patterns

### Compound Components

```tsx
// Parent
export function Menu({ children }) {
  return <nav>{children}</nav>;
}

// Children
Menu.Item = function MenuItem({ href, children }) {
  return <a href={href}>{children}</a>;
};

// Usage
<Menu>
  <Menu.Item href="/home">Home</Menu.Item>
  <Menu.Item href="/about">About</Menu.Item>
</Menu>;
```

### Controlled vs Uncontrolled

```tsx
// Controlled (state in parent)
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}

// Uncontrolled (state in component)
function UncontrolledInput({ defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

### Render Props

```tsx
function DataFetcher({ render, url }) {
  const [data, setData] = useState(null);
  // fetch logic...
  return render(data);
}

// Usage
<DataFetcher url="/api/items" render={(data) => <ItemList items={data} />} />;
```
