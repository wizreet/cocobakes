# Troubleshooting Guide

Common issues and their solutions for the CocoBakes website.

## 🔴 Build Errors

### "Cannot find module" Error

**Symptom:**

```
Error: Cannot find module '@/components/react'
```

**Solutions:**

1. Check import path is correct
2. Ensure component is exported from index.ts
3. Run `pnpm install` to refresh node_modules
4. Restart the dev server

### TypeScript Errors

**Symptom:**

```
Type 'string' is not assignable to type 'number'
```

**Solutions:**

1. Check the type definition in `src/types/`
2. Ensure data matches the expected type
3. Run `pnpm astro check` for detailed errors

### Image Import Errors

**Symptom:**

```
Cannot find module '@/assets/image.jpg'
```

**Solutions:**

1. Verify file exists in `src/assets/`
2. Check file extension matches exactly
3. Use correct import syntax:
   ```typescript
   import image from '@/assets/image.jpg';
   ```

---

## 🟡 Development Issues

### Dev Server Won't Start

**Symptom:**

```
Port 4321 is already in use
```

**Solutions:**

1. Kill existing process:

   ```bash
   # Windows
   netstat -ano | findstr :4321
   taskkill /PID <PID> /F

   # Mac/Linux
   lsof -i :4321
   kill -9 <PID>
   ```

2. Use different port:
   ```bash
   pnpm dev --port 3000
   ```

### Hot Reload Not Working

**Solutions:**

1. Save file again
2. Restart dev server
3. Clear browser cache
4. Check for syntax errors in console

### Styles Not Applying

**Solutions:**

1. Check class name spelling
2. Ensure Tailwind class is valid
3. Check for conflicting styles
4. Run `pnpm dev` to rebuild styles

---

## 🟠 Deployment Issues

### GitHub Pages 404

**Symptom:** Site shows 404 after deployment

**Solutions:**

1. Check `base` in astro.config.mjs matches repo name:
   ```javascript
   base: '/cocobakes/',
   ```
2. Verify GitHub Pages is enabled in settings
3. Check Actions workflow completed successfully

### Images Not Loading in Production

**Solutions:**

1. Use `import.meta.env.BASE_URL` for paths:
   ```astro
   <img src={`${import.meta.env.BASE_URL}images/logo.png`} />
   ```
2. Place static images in `public/` folder
3. Check image paths are relative

### Links Broken in Production

**Solutions:**

1. Always use BASE_PATH for internal links:
   ```typescript
   import { BASE_PATH } from '@/constants';
   const menuLink = `${BASE_PATH}menu`;
   ```
2. Check for hardcoded paths

---

## 🟢 Component Issues

### React Component Not Interactive

**Symptom:** Buttons don't work, state doesn't change

**Solutions:**

1. Add client directive to component:
   ```astro
   <MyComponent client:load />
   ```
2. Check event handlers are properly attached
3. Verify component is exported correctly

### Component Not Re-rendering

**Solutions:**

1. Check state is updating correctly
2. Ensure using proper state setter:

   ```typescript
   // Wrong
   state.value = newValue;

   // Correct
   setState(newValue);
   ```

3. Check for missing dependencies in useEffect

### Memo Not Working

**Solutions:**

1. Ensure props are stable (use useMemo/useCallback):
   ```typescript
   // Props must be referentially stable
   const memoizedValue = useMemo(() => computeValue(x), [x]);
   const memoizedCallback = useCallback(() => doThing(), []);
   ```

---

## 🔵 Content Issues

### Offers Not Showing

**Checklist:**

- [ ] `isActive: true` in offer config
- [ ] Current date is between startDate and endDate
- [ ] `bannerConfig.showBanner: true`
- [ ] No syntax errors in offers.ts

### Menu Items Missing

**Checklist:**

- [ ] Item exists in menu-items.ts
- [ ] `isAvailable: true`
- [ ] Category is valid
- [ ] Image import is correct

### Images Wrong Size/Quality

**Solutions:**

1. Optimize images before adding
2. Check recommended sizes in docs
3. Use appropriate format (JPEG for photos)

---

## ⚪ Performance Issues

### Slow Page Load

**Solutions:**

1. Check image sizes (should be < 200KB each)
2. Run Lighthouse audit
3. Check for unnecessary re-renders
4. Verify code splitting is working

### High CLS (Layout Shift)

**Solutions:**

1. Add width/height to images:
   ```html
   <img width="800" height="600" src="..." />
   ```
2. Reserve space for dynamic content
3. Avoid inserting content above existing content

### Slow Interactions

**Solutions:**

1. Check for expensive computations in render
2. Use useMemo for heavy calculations
3. Debounce input handlers

---

## 📱 Mobile Issues

### Layout Broken on Mobile

**Solutions:**

1. Check responsive classes:
   ```html
   <div class="flex-col md:flex-row"></div>
   ```
2. Test with DevTools mobile view
3. Check for fixed widths

### Touch Not Working

**Solutions:**

1. Ensure click handlers are on proper elements
2. Check for overlapping elements
3. Verify touch targets are large enough (44x44px)

---

## 🛠️ Quick Fixes

### Reset Everything

```bash
# Remove node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear build cache
rm -rf dist .astro
pnpm build
```

### Check for Errors

```bash
# TypeScript check
pnpm astro check

# Lint check
pnpm lint

# Full build test
pnpm build
```

### Fresh Start

```bash
# Clone fresh copy
git clone https://github.com/wizreet/cocobakes.git
cd cocobakes/astro-bakery
pnpm install
pnpm dev
```

---

## 📞 Getting Help

If you can't solve the issue:

1. Check existing GitHub issues
2. Search error message online
3. Create new issue with:
   - Error message
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

## 📚 Resources

- [Astro Docs](https://docs.astro.build)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
