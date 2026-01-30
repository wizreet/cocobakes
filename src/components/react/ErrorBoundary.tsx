/**
 * React Error Boundary Component
 * Catches JavaScript errors in child component tree and displays fallback UI
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { logError } from '@/config';

// ============================================================================
// Error Boundary Types
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ============================================================================
// Default Fallback Component
// ============================================================================

interface ErrorFallbackProps {
  error?: Error | null;
  resetError?: () => void;
}

export function ErrorFallback({
  error,
  resetError,
}: ErrorFallbackProps): JSX.Element {
  return (
    <div
      role="alert"
      className="bg-red-50 flex flex-col items-center justify-center gap-4 rounded-lg p-6 text-center"
    >
      <div className="bg-red-100 flex h-12 w-12 items-center justify-center rounded-full">
        <svg
          className="text-red-600 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <div>
        <h2 className="font-semibold text-red-800 text-lg">
          Something went wrong
        </h2>
        <p className="text-red-600 mt-1 text-sm">
          {error?.message || 'An unexpected error occurred'}
        </p>
      </div>

      {resetError && (
        <button
          onClick={resetError}
          className="bg-red-600 font-medium text-white hover:bg-red-700 focus:ring-red-500 rounded-md px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Error Boundary Component
// ============================================================================

/**
 * Error Boundary class component
 * Must be a class component as React doesn't support error boundaries with hooks
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to error reporting service
    logError(error, 'ErrorBoundary');

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback or default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback error={this.state.error} resetError={this.resetError} />
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Specialized Error Boundaries
// ============================================================================

interface ComponentErrorBoundaryProps {
  children: ReactNode;
  componentName?: string;
}

/**
 * Error boundary for individual components with contextual fallback
 */
export function ComponentErrorBoundary({
  children,
  componentName,
}: ComponentErrorBoundaryProps): JSX.Element {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-gray-100 text-gray-500 rounded-lg p-4 text-center text-sm">
          {componentName
            ? `Unable to load ${componentName}`
            : 'This section is temporarily unavailable'}
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Error boundary for page-level errors
 */
export function PageErrorBoundary({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-8">
          <ErrorFallback />
          <a
            href="/"
            className="text-sm text-brand underline hover:text-brand-hover"
          >
            Return to homepage
          </a>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
