/**
 * Contact information configuration
 * Centralized business contact details
 */

import { BUSINESS, SOCIAL_URLS } from '@/constants';
import type { ContactInfo } from '@/types';

/**
 * Contact information for CocoBakes
 * All values are readonly to prevent accidental mutation
 */
const contactInfo: ContactInfo = {
  phone: {
    href: `tel:+${BUSINESS.PHONE_RAW}`,
    text: BUSINESS.PHONE,
  },
  email: {
    href: `mailto:${BUSINESS.EMAIL}`,
    text: BUSINESS.EMAIL,
  },
  address: {
    href: SOCIAL_URLS.GOOGLE_MAPS,
    text: BUSINESS.LOCATION,
  },
  whatsapp: {
    href: SOCIAL_URLS.WHATSAPP,
    text: 'Chat on WhatsApp',
  },
} as const;

export default contactInfo;
