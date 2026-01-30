# Editing Menu Items

This guide explains how to add, edit, and manage menu items on the CocoBakes website.

## 📁 File Location

Menu items are configured in: `src/data/menu-items.ts`

## 📝 Menu Item Structure

```typescript
{
  // Unique identifier (auto-generated or custom)
  id: 'classic-brownie',

  // Display name
  name: 'Classic Chocolate Brownie',

  // Description
  description: 'Rich, fudgy brownie made with premium cocoa',

  // Price in NPR (number, not string)
  price: 150,

  // Category for filtering
  category: 'brownies',

  // Image import
  image: classicBrownieImage,

  // Optional tags
  tags: ['bestseller', 'vegetarian'],

  // Is item currently available?
  isAvailable: true,

  // Is item featured on homepage?
  isFeatured: true,
}
```

## 🍰 Adding a New Menu Item

### Step 1: Add the Image

1. Add your image to `src/assets/menu/` folder
2. Use descriptive filename: `new-item-name.jpg`
3. Recommended size: 800x600px, optimized for web

### Step 2: Import the Image

At the top of `menu-items.ts`, add:

```typescript
import newItemImage from '@/assets/menu/new-item-name.jpg';
```

### Step 3: Add the Item

Add to the `menuItems` array:

```typescript
{
  id: 'new-item-name',
  name: 'New Delicious Item',
  description: 'Describe what makes it special',
  price: 200,
  category: 'brownies', // or 'cakes', 'cookies', etc.
  image: newItemImage,
  tags: ['new'],
  isAvailable: true,
  isFeatured: false,
},
```

## 📂 Categories

Current categories defined in `menuCategories`:

| Category ID | Display Name      |
| ----------- | ----------------- |
| `all`       | All Items         |
| `brownies`  | Brownies          |
| `cakes`     | Cakes             |
| `cookies`   | Cookies           |
| `seasonal`  | Seasonal Specials |

### Adding a New Category

1. Add to `menuCategories` array:

```typescript
export const menuCategories = [
  { id: 'all', name: 'All Items', icon: 'heroicons:squares-2x2-solid' },
  { id: 'brownies', name: 'Brownies', icon: 'heroicons:cake-solid' },
  // Add new category:
  { id: 'pastries', name: 'Pastries', icon: 'heroicons:sparkles-solid' },
];
```

2. Use the new category in menu items:

```typescript
{
  // ...
  category: 'pastries',
  // ...
}
```

## 🏷️ Tags

Use tags for filtering and badges:

| Tag           | Use Case             |
| ------------- | -------------------- |
| `bestseller`  | Top selling items    |
| `new`         | Recently added items |
| `seasonal`    | Limited time items   |
| `vegetarian`  | Contains no meat     |
| `vegan`       | No animal products   |
| `gluten-free` | No gluten            |
| `spicy`       | Has spicy elements   |

## 💰 Updating Prices

Simply change the `price` value:

```typescript
// Before
price: 150,

// After price increase
price: 175,
```

**Note:** Prices are in NPR (Nepali Rupees).

## 🔄 Making Item Unavailable

Set `isAvailable: false`:

```typescript
{
  // ...
  isAvailable: false, // Won't show on menu
  // ...
}
```

## ⭐ Featured Items

Items with `isFeatured: true` appear on the homepage.

**Recommended:** Keep 3-4 featured items for best homepage appearance.

## 🗑️ Removing an Item

**Option 1: Soft delete (recommended)**

```typescript
isAvailable: false,
```

**Option 2: Comment out**

```typescript
// {
//   id: 'old-item',
//   ...
// },
```

**Option 3: Delete entirely**
Remove the entire object from the array.

## 📷 Image Guidelines

| Property     | Recommendation      |
| ------------ | ------------------- |
| Format       | JPEG or WebP        |
| Size         | 800x600px           |
| Aspect Ratio | 4:3 or 1:1          |
| File Size    | Under 200KB         |
| Quality      | High, but optimized |

### Optimizing Images

Use online tools like:

- [Squoosh](https://squoosh.app/)
- [TinyPNG](https://tinypng.com/)

Or run locally:

```bash
# Using sharp (already installed)
npx sharp-cli resize 800 --output optimized/ src/assets/menu/*.jpg
```

## ✅ Checklist

- [ ] Image added to `src/assets/menu/`
- [ ] Image imported at top of file
- [ ] All required fields filled
- [ ] Price is a number (not string)
- [ ] Category exists in `menuCategories`
- [ ] Run `pnpm build` to verify

## 🐛 Troubleshooting

### Image not showing

1. Check import path is correct
2. Check file extension matches
3. Ensure file exists in assets folder

### Item not appearing

1. Check `isAvailable: true`
2. Check category is valid
3. Check for syntax errors (run `pnpm build`)

### Build errors

```bash
# Check for errors
pnpm astro check

# View detailed errors
pnpm build
```
