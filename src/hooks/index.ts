/**
 * Custom React Hooks
 * Reusable logic extracted following React best practices
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { UI } from '@/constants';

// ============================================================================
// useScrollEffect - Header scroll animation
// ============================================================================

interface ScrollStyle {
  padding: string;
  opacity: number;
}

interface UseScrollEffectOptions {
  initialPaddingDesktop?: number;
  initialPaddingMobile?: number;
  scrolledPadding?: number;
  maxScroll?: number;
}

/**
 * Hook for handling header scroll effects
 */
export function useScrollEffect(
  options: UseScrollEffectOptions = {},
): ScrollStyle {
  const {
    initialPaddingDesktop = 48,
    initialPaddingMobile = 32,
    scrolledPadding = 32,
    maxScroll = UI.HEADER_SCROLL_THRESHOLD,
  } = options;

  const [scrollStyle, setScrollStyle] = useState<ScrollStyle>({
    padding: '2rem',
    opacity: 0,
  });

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / maxScroll, 1);

      const initialPadding =
        window.innerWidth >= 1024
          ? initialPaddingDesktop
          : initialPaddingMobile;
      const padding =
        initialPadding - (initialPadding - scrolledPadding) * progress;

      setScrollStyle({
        padding: `${padding / 16}rem`,
        opacity: progress,
      });
    };

    // Call once on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [initialPaddingDesktop, initialPaddingMobile, scrolledPadding, maxScroll]);

  return scrollStyle;
}

// ============================================================================
// useBodyScrollLock - Prevent body scroll when modal/menu is open
// ============================================================================

/**
 * Hook to lock body scroll when a modal or menu is open
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (isLocked) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isLocked]);
}

// ============================================================================
// useToggle - Boolean state toggle
// ============================================================================

type UseToggleReturn = [boolean, () => void, (value: boolean) => void];

/**
 * Hook for managing boolean toggle state
 */
export function useToggle(initialValue = false): UseToggleReturn {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}

// ============================================================================
// useDebounce - Debounced value
// ============================================================================

/**
 * Hook for debouncing a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// useLocalStorage - Persist state to localStorage
// ============================================================================

type UseLocalStorageReturn<T> = [T, (value: T | ((prev: T) => T)) => void];

/**
 * Hook for persisting state to localStorage with type safety
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): UseLocalStorageReturn<T> {
  // Get initial value from localStorage or use default
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;

          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }

          return valueToStore;
        });
      } catch {
        // Silently fail in production
      }
    },
    [key],
  );

  return [storedValue, setValue];
}

// ============================================================================
// useMediaQuery - Responsive breakpoint detection
// ============================================================================

/**
 * Hook for detecting media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Common breakpoint hooks
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

// ============================================================================
// useClickOutside - Detect clicks outside element
// ============================================================================

/**
 * Hook for detecting clicks outside a referenced element
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
}

// ============================================================================
// useKeyPress - Keyboard event handling
// ============================================================================

/**
 * Hook for handling specific key presses
 */
export function useKeyPress(targetKey: string, callback: () => void): void {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (event.key === targetKey) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [targetKey, callback]);
}

// ============================================================================
// usePriceCalculation - Brownie builder pricing logic
// ============================================================================

import type { BuilderOption, PriceBreakdown, QuantityPreset } from '@/types';

interface UsePriceCalculationOptions {
  base: BuilderOption | null;
  toppings: BuilderOption[];
  extras: BuilderOption[];
  quantity: number;
  presets: readonly QuantityPreset[];
}

/**
 * Hook for calculating brownie builder prices
 */
export function usePriceCalculation({
  base,
  toppings,
  extras,
  quantity,
  presets,
}: UsePriceCalculationOptions): PriceBreakdown {
  return useMemo(() => {
    let unit = 0;
    if (base) unit += base.price;
    unit += toppings.reduce((sum, t) => sum + t.price, 0);
    unit += extras.reduce((sum, e) => sum + e.price, 0);

    const total = unit * quantity;
    const preset = presets.find((p) => p.quantity === quantity);
    const discountPercent = preset?.discount || 0;
    const discountAmount = (total * discountPercent) / 100;
    const final = total - discountAmount;

    return {
      unitPrice: unit,
      totalPrice: total,
      discount: discountPercent,
      finalPrice: final,
    };
  }, [base, toppings, extras, quantity, presets]);
}

// ============================================================================
// useFormSubmission - Form submission state management
// ============================================================================

import type { FormSubmissionStatus } from '@/types';

interface UseFormSubmissionReturn {
  status: FormSubmissionStatus;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  submit: (handler: () => Promise<void>) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for managing form submission state
 */
export function useFormSubmission(): UseFormSubmissionReturn {
  const [status, setStatus] = useState<FormSubmissionStatus>('idle');

  const submit = useCallback(async (handler: () => Promise<void>) => {
    setStatus('submitting');
    try {
      await handler();
      setStatus('success');

      // Auto-reset after success timeout
      setTimeout(() => {
        setStatus('idle');
      }, UI.FORM_SUCCESS_TIMEOUT);
    } catch (error) {
      setStatus('error');
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
  }, []);

  return {
    status,
    isSubmitting: status === 'submitting',
    isSuccess: status === 'success',
    isError: status === 'error',
    submit,
    reset,
  };
}
