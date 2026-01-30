/**
 * Business opening hours configuration
 */

import type { OpeningHours } from '@/types';

/**
 * Opening hours for CocoBakes
 * Follows Nepal business hours standard
 */
const openingHours: readonly OpeningHours[] = [
  { days: 'Sunday - Friday', hours: '10:00 AM - 7:00 PM' },
  { days: 'Saturday', hours: '11:00 AM - 8:00 PM' },
] as const;

export default openingHours;
