/**
 * Centralized type definitions for the CocoBakes application
 * Following TypeScript best practices for maintainability and type safety
 */

// ============================================================================
// Base Types & Utility Types
// ============================================================================

/** Price in NPR (Nepalese Rupee) */
export type Price = number;

/** Unique identifier for entities */
export type EntityId = string;

/** Image metadata from Astro's image processing */
export interface ImageAsset {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly format: string;
}

/** Astro's ImageMetadata type (alias for compatibility) */
export type ImageMetadata = ImageAsset;

// ============================================================================
// Contact & Business Types
// ============================================================================

export interface ContactLink {
  readonly href: string;
  readonly text: string;
}

export interface ContactInfo {
  readonly phone: ContactLink;
  readonly email: ContactLink;
  readonly address: ContactLink;
  readonly whatsapp: ContactLink;
}

export interface OpeningHours {
  readonly days: string;
  readonly hours: string;
}

export interface SocialLink {
  readonly href: string;
  readonly text: string;
  readonly icon: string;
}

export interface SocialLinks {
  readonly instagram: SocialLink;
  readonly facebook: SocialLink;
  readonly whatsapp: SocialLink;
}

// ============================================================================
// Menu & Product Types
// ============================================================================

export type MenuCategory = 'signature' | 'premium' | 'specialty' | 'seasonal';

export interface MenuItem {
  readonly id: EntityId;
  readonly name: string;
  readonly description: string;
  readonly price: Price;
  readonly image: ImageMetadata;
  readonly category: MenuCategory;
  readonly isPopular?: boolean;
  readonly isNew?: boolean;
}

export interface MenuCategoryInfo {
  readonly id: string;
  readonly name: string;
}

// ============================================================================
// Brownie Builder Types
// ============================================================================

export interface BuilderOption {
  readonly id: EntityId;
  readonly name: string;
  readonly price: Price;
  readonly description?: string;
  readonly image?: string;
}

export interface BuilderCategory {
  readonly id: EntityId;
  readonly name: string;
  readonly description: string;
  readonly required: boolean;
  readonly maxSelections: number;
  readonly options: readonly BuilderOption[];
}

export interface QuantityPreset {
  readonly quantity: number;
  readonly label: string;
  readonly discount: number;
}

export interface QuantityOptions {
  readonly min: number;
  readonly max: number;
  readonly presets: readonly QuantityPreset[];
}

export interface BuilderSelectionState {
  base: BuilderOption | null;
  toppings: BuilderOption[];
  extras: BuilderOption[];
  quantity: number;
}

export interface PriceBreakdown {
  readonly unitPrice: Price;
  readonly totalPrice: Price;
  readonly discount: number;
  readonly finalPrice: Price;
}

// ============================================================================
// Testimonial Types
// ============================================================================

export interface Testimonial {
  readonly image: ImageAsset;
  readonly name: string;
  readonly text: string;
  readonly evidenceImage?: ImageAsset;
}

export interface TestimonialColumns {
  readonly firstColumn: readonly Testimonial[];
  readonly secondColumn: readonly Testimonial[];
  readonly thirdColumn: readonly Testimonial[];
}

// ============================================================================
// Featured Delights Types
// ============================================================================

export interface FeaturedDelight {
  readonly image: ImageAsset;
  readonly title: string;
  readonly description: string;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavLink {
  readonly href: string;
  readonly text: string;
  readonly icon?: string;
}

export interface FooterColumn {
  readonly title: string;
  readonly list: readonly (ContactLink | { readonly text: string })[];
}

export interface FooterData {
  readonly info: readonly ContactLink[];
  readonly columns: readonly FooterColumn[];
}

// ============================================================================
// Form Types
// ============================================================================

export interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

export type FormSubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

// ============================================================================
// Image Gallery Types
// ============================================================================

export interface ImageGalleryColumns {
  readonly firstColumn: readonly ImageAsset[];
  readonly secondColumn: readonly ImageAsset[];
  readonly thirdColumn: readonly ImageAsset[];
}

// ============================================================================
// Component Prop Types
// ============================================================================

export interface WithClassName {
  readonly className?: string;
}

export interface WithChildren {
  readonly children: React.ReactNode;
}

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'whatsapp'
  | 'instagram'
  | 'facebook';
export type ButtonSize = 'medium' | 'large';
