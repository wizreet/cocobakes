/**
 * Input Component
 * Accessible form input with error handling and validation states
 */

import { cx } from 'class-variance-authority';
import { forwardRef, type InputHTMLAttributes, type ForwardedRef } from 'react';

// ============================================================================
// Types
// ============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Unique identifier for the input (required for accessibility) */
  id: string;
  /** Label text displayed above the input */
  label: string;
  /** Error message to display (also sets aria-invalid) */
  error?: string;
}

// ============================================================================
// Component
// ============================================================================

export const Input = forwardRef(function Input(
  {
    id,
    label,
    type = 'text',
    required = true,
    className,
    error,
    ...props
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-primary text-heading-xl font-bold text-brand"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        ref={ref}
        id={id}
        name={id}
        type={type}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={cx(
          'h-14 rounded-md border bg-surface px-3 font-secondary text-body-md font-regular text placeholder:text-secondary/50',
          'focus-visible:outline-none focus-visible:ring-1',
          hasError
            ? 'border-red-500 ring-red-500 focus-visible:border-red-500 focus-visible:ring-red-500'
            : 'border-primary ring-brand-hover focus-visible:border-brand-hover',
          className,
        )}
        {...props}
      />

      {hasError && (
        <p id={errorId} role="alert" className="text-red-500 text-body-sm">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
