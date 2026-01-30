/**
 * OfferBanner Component
 * Premium scrolling promotional banner with gradient effects
 */

import { memo, useMemo } from 'react';
import { cx } from 'class-variance-authority';
import {
  getBannerOffers,
  bannerConfig,
  hasActiveOffers,
  type Offer,
} from '@/data/offers';
import { BASE_PATH } from '@/constants';

// ============================================================================
// Types
// ============================================================================

interface OfferBannerProps {
  className?: string;
}

interface OfferItemProps {
  offer: Offer;
}

// ============================================================================
// Sub-components
// ============================================================================

const OfferItem = memo(function OfferItem({ offer }: OfferItemProps) {
  return (
    <a
      href={offer.ctaLink || `${BASE_PATH}offers`}
      className="group inline-flex items-center gap-3 whitespace-nowrap px-8 transition-all duration-300 hover:scale-105"
    >
      {offer.emoji && (
        <span className="text-xl drop-shadow-sm" role="img" aria-hidden="true">
          {offer.emoji}
        </span>
      )}
      <span className="font-brand text-lg font-bold tracking-wide">{offer.shortText}</span>
      <span className="rounded-full bg-amber-900/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-100 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:bg-amber-900 group-hover:shadow-md">
        {offer.ctaText}
      </span>
    </a>
  );
});

const Separator = memo(function Separator() {
  return (
    <span className="mx-6 inline-flex items-center" aria-hidden="true">
      <span className="h-1 w-1 rounded-full bg-amber-900/40 shadow-sm" />
      <span className="mx-2 h-1.5 w-1.5 rounded-full bg-amber-900/60 shadow-sm" />
      <span className="h-1 w-1 rounded-full bg-amber-900/40 shadow-sm" />
    </span>
  );
});

// ============================================================================
// Main Component
// ============================================================================

export const OfferBanner = memo(function OfferBanner({
  className,
}: OfferBannerProps) {
  const activeOffers = useMemo(() => getBannerOffers(), []);

  if (
    !bannerConfig.showBanner ||
    !hasActiveOffers() ||
    activeOffers.length === 0
  ) {
    return null;
  }

  const bannerContent = (
    <>
      {activeOffers.map((offer, index) => (
        <span key={offer.id} className="inline-flex items-center">
          <OfferItem offer={offer} />
          {index < activeOffers.length - 1 && <Separator />}
        </span>
      ))}
      <Separator />
    </>
  );

  return (
    <div
      className={cx(
        'relative w-full overflow-hidden',
        'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600',
        'text-amber-950 shadow-lg',
        className,
      )}
      role="region"
      aria-label="Current offers and promotions"
    >
      {/* Shimmer overlay for premium look */}
      <div
        className="from-transparent to-transparent pointer-events-none absolute inset-0 bg-gradient-to-r via-white/10"
        style={{
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />

      {/* Glow edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-amber-600 via-amber-600/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-amber-600 via-amber-600/80 to-transparent" />

      {/* Scrolling content */}
      <div
        className={cx(
          'flex items-center py-3 text-sm',
          'animate-banner-scroll',
          bannerConfig.pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        <div className="flex shrink-0 items-center">{bannerContent}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {bannerContent}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {bannerContent}
        </div>
      </div>

      {/* Subtle top/bottom border glow */}
      <div className="from-transparent to-transparent pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r via-white/30" />
      <div className="from-transparent to-transparent pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r via-white/20" />

      {/* Screen reader link */}
      <a
        href={`${BASE_PATH}offers`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-1/2 focus:top-1/2 focus:z-20 focus:-translate-x-1/2 focus:-translate-y-1/2 focus:rounded focus:bg-amber-100 focus:px-4 focus:py-2 focus:text-amber-900 focus:shadow-lg"
      >
        View all offers
      </a>
    </div>
  );
});

export default OfferBanner;
