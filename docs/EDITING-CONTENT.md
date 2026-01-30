# Editing Website Content

This guide explains how to modify text, images, and other content throughout the CocoBakes website.

## 📁 Content Locations

| Content Type      | File Location                   |
| ----------------- | ------------------------------- |
| Menu Items        | `src/data/menu-items.ts`        |
| Offers/Promotions | `src/data/offers.ts`            |
| Featured Items    | `src/data/featured-delights.ts` |
| Testimonials      | `src/data/testimonials.ts`      |
| Contact Info      | `src/data/contact-info.ts`      |
| Opening Hours     | `src/data/opening-hours.ts`     |
| Social Links      | `src/data/social-links.ts`      |
| Gallery Images    | `src/data/image-gallery.ts`     |
| Brownie Builder   | `src/data/brownie-builder.ts`   |
| Footer Links      | `src/data/footer.ts`            |

## 🏢 Business Information

### Contact Information

Edit `src/data/contact-info.ts`:

```typescript
export default {
  phone: '+977 9849805290',
  email: 'cocobakesnp@gmail.com',
  address: 'Lalitpur, Nepal',
  whatsapp: '9779849805290',
};
```

### Opening Hours

Edit `src/data/opening-hours.ts`:

```typescript
export default {
  weekdays: '10:00 AM - 8:00 PM',
  saturday: '10:00 AM - 6:00 PM',
  sunday: 'Closed',
  // Or custom format:
  schedule: [
    { day: 'Monday - Friday', hours: '10:00 AM - 8:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ],
};
```

### Social Media Links

Edit `src/data/social-links.ts` or `src/constants/index.ts`:

```typescript
export const SOCIAL_URLS = {
  INSTAGRAM: 'https://instagram.com/cocobakes.np',
  FACEBOOK: 'https://facebook.com/cocobakes.np',
  WHATSAPP: 'https://wa.me/9779849805290',
};
```

## 📸 Images

### Adding New Images

1. Add image to `src/assets/` folder
2. Import in the relevant file:
   ```typescript
   import myImage from '@/assets/my-image.jpg';
   ```
3. Use in the data file

### Image Recommendations

| Use Case     | Size             | Format    |
| ------------ | ---------------- | --------- |
| Hero         | 1200x800px       | JPEG/WebP |
| Menu Items   | 800x600px        | JPEG/WebP |
| Gallery      | 1200x900px       | JPEG/WebP |
| Testimonials | 200x200px        | JPEG/WebP |
| Logo         | SVG or 500x500px | SVG/PNG   |

### Optimizing Images

Before adding images, optimize them:

1. **Online:** [Squoosh](https://squoosh.app/)
2. **CLI:**
   ```bash
   npx sharp-cli -i input.jpg -o output.jpg resize 800
   ```

## ✏️ Text Content

### Homepage Text

Edit `src/pages/index.astro`:

- Hero title and description
- Section headings
- Button text

### Page-Specific Content

| Page     | File                      |
| -------- | ------------------------- |
| Homepage | `src/pages/index.astro`   |
| Menu     | `src/pages/menu.astro`    |
| Gallery  | `src/pages/gallery.astro` |
| Craft    | `src/pages/craft.astro`   |

## 🎨 Styling & Branding

### Brand Colors

Edit `tailwind.config.mjs`:

```javascript
const BRAND_COLOR = '13deg 29% 32%'; // Dark Brown
const BG_COLOR = '60deg 78% 91%'; // Cream
const FILL_COLOR = '344deg 70% 69%'; // Pink
```

### Fonts

Current fonts (from `@fontsource`):

- **Primary:** Fredoka (headings, body)
- **Brand:** Dancing Script (logo, decorative)

### Logo

Replace files in `public/`:

- `LogoCircular.jpeg` - Favicon
- `LogoVertical.jpeg` - OG image

## 🗣️ Testimonials

Edit `src/data/testimonials.ts`:

```typescript
export default {
  firstColumn: [
    {
      name: 'Customer Name',
      text: 'Their review text here...',
      image: customerImage, // Import image first
      rating: 5,
    },
  ],
  // secondColumn, thirdColumn...
};
```

## 📱 Featured Items on Homepage

Edit `src/data/featured-delights.ts`:

```typescript
export default [
  {
    title: 'Classic Brownie',
    description: 'Our signature chocolate brownie',
    image: brownieImage,
    link: '/menu',
  },
  // Add more items (max 3-4 recommended)
];
```

## 📋 SEO & Meta Tags

Edit `src/constants/index.ts`:

```typescript
export const SEO = {
  DEFAULT_TITLE: 'CocoBakes - Handcrafted Brownies from Nepal',
  DEFAULT_DESCRIPTION: 'Delicious brownies and cakes...',
  OG_IMAGE: '/LogoVertical.jpeg',
};
```

Or edit individual pages in the `<head>` section.

## ✅ Content Update Checklist

- [ ] Content is spelled correctly
- [ ] Images are optimized and correct size
- [ ] Links are working
- [ ] Phone numbers/emails are correct
- [ ] Run `pnpm build` to verify no errors
- [ ] Test locally with `pnpm dev`
- [ ] Push changes to deploy

## 🐛 Common Issues

### Build fails after content change

1. Check for syntax errors (missing commas, quotes)
2. Verify all image imports are correct
3. Run `pnpm astro check`

### Image not showing

1. Check file path is correct
2. Check file exists in `src/assets/`
3. Check import statement

### Text not updating

1. Clear browser cache
2. Restart dev server: `pnpm dev`
3. Check you edited the correct file
