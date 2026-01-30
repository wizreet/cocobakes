/**
 * TextArea Component
 * Auto-growing textarea with accessibility and error handling
 */

import {
  useState,
  useRef,
  forwardRef,
  useCallback,
  type TextareaHTMLAttributes,
  type ForwardedRef,
  type ChangeEvent,
} from 'react';
import { cx } from 'class-variance-authority';

// ============================================================================
// Types
// ============================================================================

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Unique identifier for the textarea (required for accessibility) */
  id: string;
  /** Label text displayed above the textarea */
  label: string;
  /** Error message to display (also sets aria-invalid) */
  error?: string;
}

// ============================================================================
// Constants
// ============================================================================

const BASE_HEIGHT = 56; // h-14 = 3.5rem = 56px
const LINE_HEIGHT = 24; // approximate line height

// ============================================================================
// Component
// ============================================================================

export const TextArea = forwardRef(function TextArea(
  {
    id,
    label,
    required = true,
    className,
    error,
    onInput,
    ...props
  }: TextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  const [rows, setRows] = useState(1);
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef =
    (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  /**
   * Handle textarea auto-resize on input
   */
  const handleInput = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;

      // Calculate number of rows needed
      textarea.style.height = '0';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = 'auto';

      const textHeight = scrollHeight - BASE_HEIGHT + LINE_HEIGHT;
      const numberOfLines = Math.max(1, Math.ceil(textHeight / LINE_HEIGHT));
      setRows(numberOfLines);

      // Call original onInput if provided
      onInput?.(e);
    },
    [onInput],
  );

  return (
    <div className={cx('flex flex-col gap-2', className)}>
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

      <textarea
        ref={textareaRef}
        id={id}
        name={id}
        required={required}
        rows={rows}
        onInput={handleInput}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={cx(
          'resize-none overflow-y-hidden rounded-md border bg-surface px-3 py-[0.8875rem] font-secondary text-body-md font-regular text placeholder:text-secondary/50',
          'focus-visible:outline-none focus-visible:ring-1',
          hasError
            ? 'border-red-500 ring-red-500 focus-visible:border-red-500 focus-visible:ring-red-500'
            : 'border-primary ring-brand-hover focus-visible:border-brand-hover',
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

export default TextArea;
