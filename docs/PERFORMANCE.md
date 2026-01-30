# Performance Optimization Guide

This document covers performance best practices and optimizations implemented in the CocoBakes website.

## 📊 Performance Targets

### Core Web Vitals Goals

| Metric | Target  | Good | Needs Work |
| ------ | ------- | ---- | ---------- |
| LCP    | < 2.5s  | ✅   | > 4.0s     |
| FID    | < 100ms | ✅   | > 300ms    |
| CLS    | < 0.1   | ✅   | > 0.25     |
| TTFB   | < 600ms | ✅   | > 1.5s     |

### Bundle Size Budget

| Resource | Budget     | Current |
| -------- | ---------- | ------- |
| Total JS | 200KB      | ~140KB  |
| Main CSS | 50KB       | ~30KB   |
| Images   | 500KB/page | Varies  |

## ⚡ Current Optimizations

### Build-Time

1. **Static Site Generation**
   - All pages pre-rendered at build time
   - No server-side rendering overhead

2. **Code Splitting**

   ```javascript
   // astro.config.mjs
   vite: {
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom'],
             'ui-vendor': ['@iconify/react', 'class-variance-authority'],
           },
         },
       },
     },
   }
   ```

3. **Tree Shaking**
   - Unused code eliminated
   - ES modules enable dead code elimination

4. **CSS Optimization**
   - Tailwind JIT mode
   - Unused styles purged
   - Per-page CSS splitting

### Runtime

1. **Component Memoization**

   ```tsx
   // Always memoize list items
   const MenuItem = memo(function MenuItem({ item }) {
     return <div>{item.name}</div>;
   });

   // Memoize expensive computations
   const filteredItems = useMemo(
     () => items.filter((item) => item.category === selected),
     [items, selected],
   );

   // Memoize callbacks passed to children
   const handleClick = useCallback(() => {
     setSelected(id);
   }, [id]);
   ```

2. **Image Lazy Loading**

   ```html
   <img src="{image.src}" loading="lazy" decoding="async" />
   ```

3. **Priority Hints**

   ```html
   <!-- Hero images -->
   <img src="{hero.src}" loading="eager" fetchpriority="high" />
   ```

4. **RAF Throttling**
   ```typescript
   const handleScroll = useMemo(
     () =>
       rafThrottle(() => {
         setScrollY(window.scrollY);
       }),
     [],
   );
   ```

### PWA & Caching

1. **Service Worker** (`public/sw.js`)
   - Cache-first for static assets
   - Network-first for HTML
   - Stale-while-revalidate for images

2. **Manifest** (`public/manifest.json`)
   - Installable PWA
   - Offline support

## 🔍 Monitoring Performance

### Using Lighthouse

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Performance"
4. Run audit

### Using Web Vitals

```typescript
import { initWebVitals } from '@/utils/performance';

// In your layout
initWebVitals({
  onMetric: (metric) => {
    console.log(metric.name, metric.value);
    // Send to analytics
  },
});
```

### Performance Budget Check

```bash
# Analyze bundle
pnpm build:analyze
```

## 📈 Optimization Checklist

### Images

- [ ] Use appropriate format (JPEG for photos, PNG for graphics)
- [ ] Compress images (< 200KB each)
- [ ] Provide width/height to prevent layout shift
- [ ] Use `loading="lazy"` for below-fold images
- [ ] Use `fetchpriority="high"` for hero images

### JavaScript

- [ ] Use `React.memo` for list items
- [ ] Use `useMemo` for expensive calculations
- [ ] Use `useCallback` for handler props
- [ ] Lazy load heavy components
- [ ] Avoid inline function definitions in JSX

### CSS

- [ ] Use Tailwind utilities (purged unused)
- [ ] Avoid custom CSS when possible
- [ ] Use CSS containment for complex layouts

### Fonts

- [ ] Self-host fonts (not CDN)
- [ ] Use `font-display: swap`
- [ ] Subset fonts if possible

## 🛠️ Performance Utilities

### Available in `src/utils/performance.ts`

```typescript
// RAF-based throttling
import { rafThrottle } from '@/utils';
const throttled = rafThrottle(myFunction);

// Idle callback wrapper
import { deferToIdle } from '@/utils';
deferToIdle(() => {
  // Non-critical work
});

// Preload resources
import { preloadImage } from '@/utils';
preloadImage('/images/hero.jpg');
```

## 🎯 Common Performance Issues

### Large Bundle Size

**Symptoms:** Slow initial load
**Solutions:**

1. Check for duplicate dependencies
2. Use dynamic imports for heavy components
3. Review chunk splitting configuration

### Layout Shift

**Symptoms:** CLS > 0.1
**Solutions:**

1. Add width/height to images
2. Reserve space for dynamic content
3. Avoid inserting content above existing content

### Slow Interactions

**Symptoms:** FID > 100ms
**Solutions:**

1. Break up long tasks
2. Use `requestIdleCallback` for non-critical work
3. Debounce input handlers

### Slow Images

**Symptoms:** LCP > 2.5s
**Solutions:**

1. Optimize image size/format
2. Use priority hints for hero images
3. Implement lazy loading properly

## 📱 Mobile Performance

### Tips for Mobile

1. **Reduce animations** on low-power devices:

   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation: none !important;
       transition: none !important;
     }
   }
   ```

2. **Touch-friendly interactions:**

   ```css
   @media (hover: none) {
     .hover-effect {
       /* Disable hover on touch */
     }
   }
   ```

3. **Optimize for 3G:**
   - Test with network throttling
   - Ensure site is usable on slow connections

## 📊 Benchmarks

### Expected Performance Scores

| Platform | Performance | Accessibility | Best Practices | SEO |
| -------- | ----------- | ------------- | -------------- | --- |
| Desktop  | 95+         | 100           | 100            | 100 |
| Mobile   | 85+         | 100           | 100            | 100 |

### Testing Environments

- Chrome DevTools Lighthouse
- WebPageTest
- GTmetrix
- PageSpeed Insights

## 🔄 Continuous Monitoring

Consider setting up:

1. **Lighthouse CI** in GitHub Actions
2. **Real User Monitoring (RUM)** with analytics
3. **Performance budgets** in CI/CD
