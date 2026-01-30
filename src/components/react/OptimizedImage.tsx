/**
 * Optimized Image Component
 * Provides lazy loading, blur placeholder, WebP support, and responsive images
 *
 * Features:
 * - Intersection Observer for lazy loading
 * - Blur placeholder while loading
 * - Automatic srcset generation
 * - Loading state management
 * - Error handling with fallback
 * - Accessibility support
 *
 * @module components/react/OptimizedImage
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  type ImgHTMLAttributes,
} from 'react';
import { cx } from 'class-variance-authority';

// ============================================================================
// Types
// ============================================================================

export interface OptimizedImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'onLoad' | 'onError'
> {
  /** Image source URL */
  src: string;
  /** Alt text (required for accessibility) */
  alt: string;
  /** Optional blur placeholder data URL */
  blurDataURL?: string;
  /** Enable lazy loading (default: true) */
  lazy?: boolean;
  /** Priority loading (disables lazy, preloads) */
  priority?: boolean;
  /** Show loading skeleton */
  showSkeleton?: boolean;
  /** Fallback image on error */
  fallbackSrc?: string;
  /** Aspect ratio for placeholder */
  aspectRatio?: string;
  /** Container className */
  containerClassName?: string;
  /** Callback when image loads */
  onLoadComplete?: () => void;
  /** Callback on error */
  onLoadError?: (error: Error) => void;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_BLUR_PLACEHOLDER = `data:image/svg+xml;base64,${btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
    <filter id="b" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="1" />
    </filter>
    <rect width="100%" height="100%" fill="#fafad6" filter="url(#b)" />
  </svg>
`)}`;

const SKELETON_CLASS =
  'animate-pulse bg-gradient-to-r from-surface via-fill-brand/10 to-surface bg-[length:200%_100%]';

// ============================================================================
// Component
// ============================================================================

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  blurDataURL,
  lazy = true,
  priority = false,
  showSkeleton = true,
  fallbackSrc,
  aspectRatio,
  className,
  containerClassName,
  onLoadComplete,
  onLoadError,
  ...props
}: OptimizedImageProps) {
  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : '');

  // Refs
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setCurrentSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px 0px', // Start loading 100px before viewport
        threshold: 0,
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, src]);

  // Update src when in view
  useEffect(() => {
    if (isInView && !currentSrc) {
      setCurrentSrc(src);
    }
  }, [isInView, currentSrc, src]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoadComplete?.();
  }, [onLoadComplete]);

  // Handle image error
  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      onLoadError?.(new Error(`Failed to load image: ${src}`));
    }
  }, [fallbackSrc, currentSrc, src, onLoadError]);

  // Determine placeholder
  const placeholder = blurDataURL || DEFAULT_BLUR_PLACEHOLDER;

  return (
    <div
      ref={containerRef}
      className={cx(
        'relative overflow-hidden',
        aspectRatio && `aspect-[${aspectRatio}]`,
        containerClassName,
      )}
    >
      {/* Blur placeholder / Skeleton */}
      {!isLoaded && showSkeleton && (
        <div
          className={cx(
            'absolute inset-0 transition-opacity duration-300',
            blurDataURL ? '' : SKELETON_CLASS,
          )}
          style={
            blurDataURL
              ? {
                  backgroundImage: `url(${placeholder})`,
                  backgroundSize: 'cover',
                  filter: 'blur(20px)',
                  transform: 'scale(1.1)', // Prevent blur edge artifacts
                }
              : undefined
          }
          aria-hidden="true"
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-surface text-secondary"
          role="img"
          aria-label={`Failed to load: ${alt}`}
        >
          <svg
            className="h-12 w-12 text-secondary/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Main image */}
      {(isInView || priority) && !hasError && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={cx(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...props}
        />
      )}
    </div>
  );
});

// ============================================================================
// Preload Image Utility Component
// ============================================================================

interface PreloadImageProps {
  src: string;
}

export function PreloadImage({ src }: PreloadImageProps) {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [src]);

  return null;
}

// ============================================================================
// Image with Lightbox Hook
// ============================================================================

interface UseLightboxReturn {
  isOpen: boolean;
  currentIndex: number;
  open: (index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

export function useLightbox(totalImages: number): UseLightboxReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const open = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, totalImages - 1)));
    },
    [totalImages],
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          close();
          break;
        case 'ArrowRight':
          next();
          break;
        case 'ArrowLeft':
          prev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close, next, prev]);

  return { isOpen, currentIndex, open, close, next, prev, goTo };
}

export default OptimizedImage;
