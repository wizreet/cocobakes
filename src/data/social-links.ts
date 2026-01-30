/**
 * Social media links configuration
 * Centralized social platform URLs and icons
 */

import { SOCIAL_URLS, ICONS } from '@/constants';
import type { SocialLinks } from '@/types';

/**
 * Social media links for CocoBakes
 * Uses constants for URLs to ensure consistency
 */
const socialLinks: SocialLinks = {
  instagram: {
    href: SOCIAL_URLS.INSTAGRAM,
    text: 'Instagram',
    icon: ICONS.INSTAGRAM,
  },
  facebook: {
    href: SOCIAL_URLS.FACEBOOK,
    text: 'Facebook',
    icon: ICONS.FACEBOOK,
  },
  whatsapp: {
    href: SOCIAL_URLS.WHATSAPP,
    text: 'WhatsApp',
    icon: ICONS.WHATSAPP,
  },
} as const;

export default socialLinks;
