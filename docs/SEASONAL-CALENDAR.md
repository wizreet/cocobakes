# Seasonal Promotions Calendar

This document provides pre-planned promotional templates for various holidays and occasions throughout the year. Use these as references when setting up offers.

## 📅 Annual Calendar Overview

| Month    | Holiday/Event   | Suggested Offer     |
| -------- | --------------- | ------------------- |
| January  | New Year        | New Year Special    |
| February | Valentine's Day | Valentine's Special |
| March    | Holi            | Colorful Treats     |
| April    | Nepali New Year | New Beginnings      |
| May      | Mother's Day    | Gift Boxes          |
| June     | Father's Day    | Combo Offers        |
| August   | Janai Purnima   | Traditional Treats  |
| October  | Dashain         | Festival Special    |
| November | Tihar/Diwali    | Light Festival      |
| December | Christmas       | Winter Special      |

---

## ❤️ Valentine's Day (Feb 1-14)

### Configuration

```typescript
{
  id: 'valentines-2026',
  isActive: true,
  startDate: '2026-02-01',
  endDate: '2026-02-14',
  title: "💕 Valentine's Special - 20% OFF Heart-Shaped Brownies!",
  subtitle: 'Express your love with our handcrafted treats',
  ctaText: 'Order Now',
  link: `${BASE_PATH}craft`,
  bgColor: 'bg-gradient-to-r from-pink-500 via-red-500 to-pink-500',
  textColor: 'text-white',
  icon: 'heroicons:heart-solid',
  priority: 10,
}
```

### Suggested Products

- Heart-shaped brownies
- Red velvet brownies
- Chocolate gift boxes
- Couple combos

### Marketing Ideas

- "For your sweetheart"
- Free gift wrapping
- Delivery available

---

## 🎄 Christmas (Dec 1-25)

### Configuration

```typescript
{
  id: 'christmas-2026',
  isActive: true,
  startDate: '2026-12-01',
  endDate: '2026-12-25',
  title: '🎄 Christmas Special - Gift Boxes Starting Rs. 500!',
  subtitle: 'Perfect gifts for your loved ones',
  ctaText: 'Shop Gifts',
  link: `${BASE_PATH}menu`,
  bgColor: 'bg-gradient-to-r from-red-600 via-green-600 to-red-600',
  textColor: 'text-white',
  icon: 'heroicons:gift-solid',
  priority: 10,
}
```

### Suggested Products

- Christmas-themed brownies
- Gift hampers
- Party platters
- Hot cocoa pairings

---

## 🎊 New Year (Dec 26 - Jan 7)

### Configuration

```typescript
{
  id: 'new-year-2027',
  isActive: true,
  startDate: '2026-12-26',
  endDate: '2027-01-07',
  title: '🎊 New Year Special - Start Fresh with Sweetness!',
  subtitle: 'Ring in 2027 with our special treats',
  ctaText: 'Celebrate',
  link: `${BASE_PATH}menu`,
  bgColor: 'bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600',
  textColor: 'text-white',
  icon: 'heroicons:sparkles-solid',
  priority: 10,
}
```

---

## 🪷 Dashain (October)

### Configuration

```typescript
{
  id: 'dashain-2026',
  isActive: true,
  startDate: '2026-10-05',
  endDate: '2026-10-20',
  title: '🪷 Dashain Special - Festive Treats for Your Celebrations!',
  subtitle: 'Traditional flavors with a modern twist',
  ctaText: 'Order Now',
  link: `${BASE_PATH}menu`,
  bgColor: 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-500',
  textColor: 'text-white',
  icon: 'heroicons:sun-solid',
  priority: 10,
}
```

### Suggested Products

- Special festive boxes
- Traditional flavored brownies
- Family packs

---

## 🪔 Tihar/Diwali (October-November)

### Configuration

```typescript
{
  id: 'tihar-2026',
  isActive: true,
  startDate: '2026-10-28',
  endDate: '2026-11-05',
  title: '🪔 Tihar Special - Light Up Your Festivities!',
  subtitle: 'Mithai-inspired treats & gift boxes',
  ctaText: 'Shop Now',
  link: `${BASE_PATH}menu`,
  bgColor: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400',
  textColor: 'text-gray-900',
  icon: 'heroicons:fire-solid',
  priority: 10,
}
```

---

## 👩 Mother's Day (May)

### Configuration

```typescript
{
  id: 'mothers-day-2026',
  isActive: true,
  startDate: '2026-05-05',
  endDate: '2026-05-12',
  title: "💐 Mother's Day - Treat the Special Woman in Your Life!",
  subtitle: 'Gift boxes with free personalized messages',
  ctaText: 'Order Gift',
  link: `${BASE_PATH}menu`,
  bgColor: 'bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400',
  textColor: 'text-white',
  icon: 'heroicons:heart-solid',
  priority: 10,
}
```

---

## ☀️ Summer Special (May-August)

### Configuration

```typescript
{
  id: 'summer-2026',
  isActive: true,
  startDate: '2026-05-01',
  endDate: '2026-08-31',
  title: '☀️ Summer Special - Cool Brownie Ice Cream Combos!',
  subtitle: 'Beat the heat with our refreshing combos',
  ctaText: 'Try Now',
  link: `${BASE_PATH}menu`,
  bgColor: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400',
  textColor: 'text-white',
  icon: 'heroicons:sun-solid',
  priority: 5,
}
```

---

## 🎂 Anniversary/Birthday Specials

### Configuration (Year-Round)

```typescript
{
  id: 'birthday-special',
  isActive: true,
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  title: '🎂 Birthday Special - 15% OFF Custom Cakes!',
  subtitle: 'Make celebrations sweeter',
  ctaText: 'Customize',
  link: `${BASE_PATH}craft`,
  bgColor: 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500',
  textColor: 'text-white',
  icon: 'heroicons:cake-solid',
  priority: 3,
}
```

---

## 📝 How to Use This Calendar

### Setting Up an Offer

1. **2 Weeks Before:**
   - Review offer details
   - Update dates for current year
   - Prepare products/inventory

2. **1 Week Before:**
   - Enable offer (`isActive: true`)
   - Test locally
   - Deploy to production

3. **During Promotion:**
   - Monitor orders
   - Engage on social media

4. **After Promotion:**
   - Disable offer (`isActive: false`)
   - Review performance
   - Note improvements for next year

### Quick Edit Template

Copy this to `src/data/offers.ts`:

```typescript
{
  id: 'your-offer-id',
  isActive: true,
  startDate: 'YYYY-MM-DD',
  endDate: 'YYYY-MM-DD',
  title: '🎉 Your Offer Title Here!',
  subtitle: 'Your subtitle here',
  ctaText: 'Action',
  link: `${BASE_PATH}menu`,
  bgColor: 'bg-gradient-to-r from-COLOR1 to-COLOR2',
  textColor: 'text-white',
  icon: 'heroicons:ICON-solid',
  priority: 10,
},
```

---

## 🎨 Color Quick Reference

| Occasion     | Primary    | Secondary   |
| ------------ | ---------- | ----------- |
| Valentine's  | pink-500   | red-500     |
| Christmas    | red-600    | green-600   |
| New Year     | purple-600 | pink-500    |
| Dashain      | orange-500 | red-500     |
| Tihar        | yellow-400 | orange-500  |
| Summer       | cyan-400   | blue-500    |
| Mother's Day | pink-400   | purple-400  |
| Birthday     | violet-500 | fuchsia-500 |
