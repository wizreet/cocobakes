# Editing Offers & Promotions

This guide explains how to add, edit, and manage promotional offers and banners on the CocoBakes website.

## 📁 File Location

All offer configurations are in: `src/data/offers.ts`

## 🖼️ Adding Offer Images (Posters)

1. **Add your image** to `public/images/offers/`
   - Recommended formats: WebP, JPEG, PNG
   - Recommended size: 1200x630px (16:9) or 1400x400px (21:9)
   - Example: `valentines-special.jpg`

2. **Reference in the offer**:

```typescript
{
  id: 'valentines-2026',
  image: '/images/offers/valentines-special.jpg',
  // ... other properties
}
```

## 🎯 Quick Guide

### Activate a Pre-Made Offer (e.g., Valentine's Day)

1. Open `src/data/offers.ts`
2. Find the offer template (e.g., `valentines-2026`)
3. Change `isActive: false` to `isActive: true`
4. Update the dates if needed
5. Save the file

### Deactivate an Offer

1. Open `src/data/offers.ts`
2. Find the active offer
3. Change `isActive: true` to `isActive: false`
4. Save the file

## 📝 Offer Properties Explained

```typescript
{
  // Unique ID - use kebab-case (lowercase with hyphens)
  id: 'valentines-2026',

  // Toggle offer visibility
  isActive: true,

  // Date range (YYYY-MM-DD format)
  startDate: '2026-02-01',
  endDate: '2026-02-14',

  // Main text shown in the banner
  title: "💕 Valentine's Special - 20% OFF!",

  // Optional secondary text
  subtitle: 'Express your love with our brownies',

  // Image poster (optional - placed in public/images/offers/)
  image: '/images/offers/valentines-special.jpg',

  // Call-to-action button text
  ctaText: 'View Details',

  // Where clicking leads (use BASE_PATH for internal links)
  link: `${BASE_PATH}offers`,

  // Background color (Tailwind CSS classes)
  bgColor: 'bg-gradient-to-r from-pink-500 to-red-500',

  // Text color (Tailwind CSS classes)
  textColor: 'text-white',

  // Icon (optional, from iconify)
  icon: 'heroicons:heart-solid',

  // Priority (higher = shows first if multiple active)
  priority: 10,
}
```

## 🎨 Color Presets

Copy these for common occasions:

### Valentine's Day (Pink/Red)

```typescript
bgColor: 'bg-gradient-to-r from-pink-500 via-red-500 to-pink-500',
textColor: 'text-white',
```

### Christmas (Red/Green)

```typescript
bgColor: 'bg-gradient-to-r from-red-600 via-green-600 to-red-600',
textColor: 'text-white',
```

### New Year (Purple/Pink)

```typescript
bgColor: 'bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600',
textColor: 'text-white',
```

### Summer (Cyan/Blue)

```typescript
bgColor: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400',
textColor: 'text-white',
```

### Dashain (Orange/Red)

```typescript
bgColor: 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-500',
textColor: 'text-white',
```

### Tihar/Diwali (Yellow/Orange)

```typescript
bgColor: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400',
textColor: 'text-gray-900', // Dark text for light backgrounds
```

### Default Brand

```typescript
bgColor: 'bg-fill-brand',
textColor: 'text-on-bg-fill-brand',
```

## 📅 Adding a New Offer

1. Open `src/data/offers.ts`
2. Add a new object to the `offers` array:

```typescript
{
  id: 'my-new-offer',
  isActive: true,
  startDate: '2026-03-01',
  endDate: '2026-03-31',
  title: '🌸 Spring Special - Fresh Flavors!',
  subtitle: 'New seasonal menu available',
  ctaText: 'Try Now',
  link: `${BASE_PATH}menu`,
  bgColor: 'bg-gradient-to-r from-green-400 to-emerald-500',
  textColor: 'text-white',
  icon: 'heroicons:sun-solid',
  priority: 8,
},
```

3. Save and deploy

## ⚙️ Banner Configuration

Control global banner settings in `bannerConfig`:

```typescript
export const bannerConfig = {
  // Show/hide the scrolling banner
  showBanner: true,

  // Show/hide "Offers" link in navbar
  showNavLink: true,

  // Scroll speed (seconds for one complete loop)
  // Lower = faster, Higher = slower
  scrollSpeed: 30,

  // Pause scrolling when mouse hovers
  pauseOnHover: true,
};
```

## 🔗 Icons Reference

Common icons you can use:

| Icon     | Code                       |
| -------- | -------------------------- |
| Heart    | `heroicons:heart-solid`    |
| Gift     | `heroicons:gift-solid`     |
| Sparkles | `heroicons:sparkles-solid` |
| Fire     | `heroicons:fire-solid`     |
| Sun      | `heroicons:sun-solid`      |
| Star     | `heroicons:star-solid`     |
| Cake     | `heroicons:cake-solid`     |
| Tag      | `heroicons:tag-solid`      |

Browse more at: https://icon-sets.iconify.design/heroicons/

## ✅ Checklist Before Publishing

- [ ] `isActive` is set correctly (true/false)
- [ ] Dates are in correct format (YYYY-MM-DD)
- [ ] Start date is before end date
- [ ] Link is valid and working
- [ ] Text is spelled correctly
- [ ] Colors look good (test locally first)
- [ ] Run `pnpm build` to check for errors

## 🐛 Troubleshooting

### Banner not showing

1. Check `isActive: true`
2. Check dates are current (not in past/future)
3. Check `bannerConfig.showBanner: true`

### Colors not appearing

1. Ensure using valid Tailwind classes
2. Try running `pnpm dev` to rebuild styles

### Link not working

1. Use `${BASE_PATH}` for internal links
2. Use full URL for external links
