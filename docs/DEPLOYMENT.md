# Deployment Guide

This guide covers deploying the CocoBakes website to GitHub Pages and other platforms.

## 🚀 GitHub Pages (Default)

The site is configured to automatically deploy to GitHub Pages.

### How It Works

1. Push code to `main` branch
2. GitHub Actions workflow triggers
3. Site builds and deploys
4. Live at: `https://wizreet.github.io/cocobakes/`

### Configuration

**astro.config.mjs:**

```javascript
export default defineConfig({
  site: 'https://wizreet.github.io',
  base: '/cocobakes/',
  // ...
});
```

**GitHub Repository Settings:**

1. Go to Settings → Pages
2. Source: GitHub Actions
3. (Workflow handles the rest)

### Manual Deployment

If automatic deployment fails:

```bash
# Build locally
pnpm build

# The dist/ folder can be manually uploaded to Pages
```

## 📋 Pre-Deployment Checklist

Before pushing to deploy:

- [ ] Run `pnpm build` locally (no errors)
- [ ] Test locally with `pnpm preview`
- [ ] Check all links work
- [ ] Verify images load
- [ ] Test on mobile (responsive)
- [ ] Check forms work
- [ ] Run `pnpm lint` (no errors)

## 🔄 GitHub Actions Workflow

File: `.github/workflows/ci.yml`

### Workflow Steps

```yaml
1. Lint & Type Check
├── Install dependencies
├── Run ESLint
└── Run astro check

2. Build
├── Install dependencies
├── Build site
└── Upload artifacts

3. Deploy (only on main)
├── Download artifacts
└── Deploy to GitHub Pages
```

### Triggering Deployment

**Automatic:**

- Push to `main` branch
- Merge PR to `main`

**Manual (if needed):**

1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"

## 🌐 Custom Domain (Optional)

### Setting Up Custom Domain

1. **DNS Configuration:**

   ```
   Type: CNAME
   Name: www
   Value: wizreet.github.io

   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

2. **GitHub Settings:**
   - Settings → Pages → Custom domain
   - Enter: `www.yourdomain.com`
   - Enable "Enforce HTTPS"

3. **Update astro.config.mjs:**

   ```javascript
   export default defineConfig({
     site: 'https://www.yourdomain.com',
     base: '/', // Remove /cocobakes/ for root domain
   });
   ```

4. **Add CNAME file:**
   Create `public/CNAME`:
   ```
   www.yourdomain.com
   ```

## 🔧 Troubleshooting Deployments

### Build Fails

**Check Actions logs:**

1. Go to Actions tab
2. Click failed workflow
3. Read error messages

**Common issues:**

- TypeScript errors → Fix type issues
- Missing dependencies → Run `pnpm install`
- Image not found → Check paths

### Site Not Updating

1. **Check deployment status:**
   - Actions tab → Latest workflow
   - Should show green check

2. **Clear cache:**
   - Hard refresh: Ctrl+Shift+R
   - Clear browser cache

3. **Wait for propagation:**
   - Can take 2-5 minutes

### 404 Errors

1. **Check base path:**

   ```javascript
   // astro.config.mjs
   base: '/cocobakes/', // Must match repo name
   ```

2. **Check links use BASE_URL:**
   ```astro
   <a href={`${import.meta.env.BASE_URL}menu`}>Menu</a>
   ```

### Images Not Loading

1. Check path is relative or uses BASE_URL
2. Verify image exists in `src/assets/` or `public/`
3. Check file extension matches

## 📊 Monitoring Deployments

### View Deployment History

1. Repository → Environments → github-pages
2. View all deployments
3. Rollback if needed

### Deployment Status Badge

Add to README:

```markdown
![Deploy Status](https://github.com/wizreet/cocobakes/actions/workflows/ci.yml/badge.svg)
```

## 🔄 Alternative Platforms

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Configuration:**

- Framework: Astro
- Build: `pnpm build`
- Output: `dist`

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**netlify.toml:**

```toml
[build]
  command = "pnpm build"
  publish = "dist"
```

### Cloudflare Pages

1. Connect GitHub repo
2. Build command: `pnpm build`
3. Build output: `dist`
4. Node version: 18

## 🔐 Environment Variables

For production secrets (if needed):

**GitHub Actions:**

1. Settings → Secrets → Actions
2. Add secret (e.g., `API_KEY`)
3. Use in workflow:
   ```yaml
   env:
     API_KEY: ${{ secrets.API_KEY }}
   ```

**Vercel/Netlify:**

- Add in dashboard under Environment Variables

## 📈 Post-Deployment

After successful deployment:

1. **Verify site loads:** Visit production URL
2. **Test all pages:** Navigate through site
3. **Check forms:** Submit test form
4. **Test on mobile:** Use phone or DevTools
5. **Check analytics:** Verify tracking works
6. **Monitor errors:** Check browser console
