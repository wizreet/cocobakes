/**
 * Performance Utilities
 * Web Vitals tracking, lazy loading, image optimization, and performance monitoring
 *
 * @module utils/performance
 */

// ============================================================================
// Web Vitals Types
// ============================================================================

export interface WebVital {
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
  id: string;
  navigationType: 'navigate' | 'reload' | 'back_forward' | 'prerender';
}

export type VitalCallback = (vital: WebVital) => void;

// ============================================================================
// Web Vitals Thresholds (as per Google's recommendations)
// ============================================================================

export const VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

// ============================================================================
// Get rating for a vital
// ============================================================================

export function getVitalRating(
  name: WebVital['name'],
  value: number,
): WebVital['rating'] {
  const threshold = VITALS_THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// ============================================================================
// Simple Web Vitals Tracking (without external library)
// ============================================================================

/**
 * Track Largest Contentful Paint (LCP)
 */
export function trackLCP(callback: VitalCallback): void {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
      startTime: number;
    };

    if (lastEntry) {
      const value = lastEntry.startTime;
      callback({
        name: 'LCP',
        value,
        rating: getVitalRating('LCP', value),
        delta: value,
        entries,
        id: crypto.randomUUID?.() ?? `lcp-${Date.now()}`,
        navigationType: 'navigate',
      });
    }
  });

  observer.observe({ type: 'largest-contentful-paint', buffered: true });
}

/**
 * Track First Contentful Paint (FCP)
 */
export function trackFCP(callback: VitalCallback): void {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntriesByName('first-contentful-paint');
    const entry = entries[0] as PerformanceEntry & { startTime: number };

    if (entry) {
      const value = entry.startTime;
      callback({
        name: 'FCP',
        value,
        rating: getVitalRating('FCP', value),
        delta: value,
        entries,
        id: crypto.randomUUID?.() ?? `fcp-${Date.now()}`,
        navigationType: 'navigate',
      });
    }
  });

  observer.observe({ type: 'paint', buffered: true });
}

/**
 * Track Cumulative Layout Shift (CLS)
 */
export function trackCLS(callback: VitalCallback): void {
  if (typeof window === 'undefined') return;

  let clsValue = 0;
  let clsEntries: PerformanceEntry[] = [];

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as (PerformanceEntry & {
      hadRecentInput: boolean;
      value: number;
    })[]) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);
      }
    }
  });

  observer.observe({ type: 'layout-shift', buffered: true });

  // Report on page hide
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.visibilityState === 'hidden') {
        callback({
          name: 'CLS',
          value: clsValue,
          rating: getVitalRating('CLS', clsValue),
          delta: clsValue,
          entries: clsEntries,
          id: crypto.randomUUID?.() ?? `cls-${Date.now()}`,
          navigationType: 'navigate',
        });
      }
    },
    { once: true },
  );
}

/**
 * Track Time to First Byte (TTFB)
 */
export function trackTTFB(callback: VitalCallback): void {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const navigationEntry = entries[0] as PerformanceNavigationTiming;

    if (navigationEntry) {
      const value = navigationEntry.responseStart;
      callback({
        name: 'TTFB',
        value,
        rating: getVitalRating('TTFB', value),
        delta: value,
        entries,
        id: crypto.randomUUID?.() ?? `ttfb-${Date.now()}`,
        navigationType: 'navigate',
      });
    }
  });

  observer.observe({ type: 'navigation', buffered: true });
}

/**
 * Initialize all Web Vitals tracking
 */
export function initWebVitals(callback: VitalCallback): void {
  trackLCP(callback);
  trackFCP(callback);
  trackCLS(callback);
  trackTTFB(callback);
}

// ============================================================================
// Lazy Loading Utilities
// ============================================================================

interface LazyLoadOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Create an intersection observer for lazy loading
 */
export function createLazyLoader(
  callback: (entry: IntersectionObserverEntry) => void,
  options: LazyLoadOptions = {},
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  const {
    root = null,
    rootMargin = '100px 0px', // Start loading 100px before viewport
    threshold = 0,
  } = options;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    },
    { root, rootMargin, threshold },
  );
}

/**
 * Preload an image
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(preloadImage));
}

// ============================================================================
// Image Optimization
// ============================================================================

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  baseSrc: string,
  widths: number[] = [320, 640, 768, 1024, 1280],
): string {
  // For local images, just return the base src
  // In production, you'd want to use an image CDN
  return widths.map((w) => `${baseSrc} ${w}w`).join(', ');
}

/**
 * Calculate optimal image size based on container
 */
export function getOptimalImageSize(
  containerWidth: number,
  devicePixelRatio: number = 1,
): number {
  const optimalWidth = containerWidth * devicePixelRatio;
  const sizes = [320, 640, 768, 1024, 1280, 1920];
  return sizes.find((s) => s >= optimalWidth) ?? sizes[sizes.length - 1];
}

/**
 * Generate blur data URL placeholder
 */
export function generateBlurPlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = '#fafad6',
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <filter id="b" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="1" />
    </filter>
    <rect width="100%" height="100%" fill="${color}" filter="url(#b)" />
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// ============================================================================
// Request Idle Callback Polyfill
// ============================================================================

type RequestIdleCallbackHandle = number;
type RequestIdleCallbackOptions = { timeout?: number };
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

/**
 * Request idle callback with fallback
 */
export function requestIdleCallbackPolyfill(
  callback: (deadline: RequestIdleCallbackDeadline) => void,
  options?: RequestIdleCallbackOptions,
): RequestIdleCallbackHandle {
  if (
    typeof window !== 'undefined' &&
    typeof window.requestIdleCallback === 'function'
  ) {
    return window.requestIdleCallback(callback, options);
  }

  // Fallback for browsers without requestIdleCallback
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, 1) as unknown as RequestIdleCallbackHandle;
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleCallbackPolyfill(
  handle: RequestIdleCallbackHandle,
): void {
  if (
    typeof window !== 'undefined' &&
    typeof window.cancelIdleCallback === 'function'
  ) {
    window.cancelIdleCallback(handle);
  } else {
    clearTimeout(handle);
  }
}

// ============================================================================
// Deferred Loading
// ============================================================================

/**
 * Defer non-critical work to idle time
 */
export function deferToIdle<T>(
  fn: () => T,
  timeout: number = 2000,
): Promise<T> {
  return new Promise((resolve) => {
    requestIdleCallbackPolyfill(
      () => {
        resolve(fn());
      },
      { timeout },
    );
  });
}

/**
 * Schedule work in chunks to avoid blocking main thread
 */
export async function scheduleChunkedWork<T, R>(
  items: T[],
  processor: (item: T) => R,
  chunkSize: number = 5,
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    await new Promise<void>((resolve) => {
      requestIdleCallbackPolyfill(() => {
        chunk.forEach((item) => {
          results.push(processor(item));
        });
        resolve();
      });
    });
  }

  return results;
}

// ============================================================================
// Memory Management
// ============================================================================

/**
 * Check if device has limited memory
 */
export function isLowMemoryDevice(): boolean {
  if (typeof navigator === 'undefined') return false;

  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.deviceMemory ?? 8) < 4;
}

/**
 * Check if device prefers reduced data
 */
export function prefersReducedData(): boolean {
  if (typeof navigator === 'undefined') return false;

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean };
    }
  ).connection;

  return connection?.saveData ?? false;
}

/**
 * Get connection type
 */
export function getConnectionType(): string {
  if (typeof navigator === 'undefined') return 'unknown';

  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: string };
    }
  ).connection;

  return connection?.effectiveType ?? 'unknown';
}

// ============================================================================
// Resource Hints
// ============================================================================

/**
 * Add preconnect hint
 */
export function addPreconnect(url: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Add DNS prefetch hint
 */
export function addDnsPrefetch(url: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Add preload hint
 */
export function addPreload(
  url: string,
  as: 'script' | 'style' | 'font' | 'image' | 'fetch',
): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

// ============================================================================
// Animation Frame Utilities
// ============================================================================

/**
 * Throttle function using requestAnimationFrame
 */
export function rafThrottle<T extends (...args: unknown[]) => void>(
  fn: T,
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return (...args: Parameters<T>) => {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  };
}

/**
 * Schedule callback for next frame
 */
export function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

// ============================================================================
// Performance Marks & Measures
// ============================================================================

/**
 * Create a performance mark
 */
export function mark(name: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure between two marks
 */
export function measure(
  name: string,
  startMark: string,
  endMark?: string,
): PerformanceMeasure | undefined {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      return performance.measure(name, startMark, endMark);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/**
 * Get all performance entries
 */
export function getPerformanceEntries(): PerformanceEntry[] {
  if (typeof performance !== 'undefined' && performance.getEntries) {
    return performance.getEntries();
  }
  return [];
}

// ============================================================================
// Export all
// ============================================================================

export const Performance = {
  // Web Vitals
  initWebVitals,
  trackLCP,
  trackFCP,
  trackCLS,
  trackTTFB,
  getVitalRating,
  VITALS_THRESHOLDS,

  // Lazy Loading
  createLazyLoader,
  preloadImage,
  preloadImages,

  // Image Optimization
  generateSrcSet,
  getOptimalImageSize,
  generateBlurPlaceholder,

  // Idle Callbacks
  requestIdleCallback: requestIdleCallbackPolyfill,
  cancelIdleCallback: cancelIdleCallbackPolyfill,
  deferToIdle,
  scheduleChunkedWork,

  // Device Detection
  isLowMemoryDevice,
  prefersReducedData,
  getConnectionType,

  // Resource Hints
  addPreconnect,
  addDnsPrefetch,
  addPreload,

  // Animation Frame
  rafThrottle,
  nextFrame,

  // Marks & Measures
  mark,
  measure,
  getPerformanceEntries,
} as const;

export default Performance;
