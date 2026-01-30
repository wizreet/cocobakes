/**
 * ContactForm Component
 * Secure form with validation, sanitization, rate limiting, and proper accessibility
 */

import { useState, useCallback, type FormEvent } from 'react';
import { cx } from 'class-variance-authority';
import Input from './Input';
import TextArea from './TextArea';
import Button from './Button';
import {
  validateContactForm,
  sanitizeString,
  type ContactFormInput,
} from '@/utils/validation';
import {
  checkRateLimit,
  isHoneypotFilled,
  truncateInput,
  INPUT_LIMITS,
} from '@/utils/security';
import { useFormSubmission } from '@/hooks';
import { logError } from '@/config';

// ============================================================================
// Types
// ============================================================================

interface ContactFormProps {
  /** Additional CSS classes */
  className?: string;
  /** Callback when form is successfully submitted */
  onSuccess?: (data: ContactFormInput) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  form?: string;
}

// ============================================================================
// Constants
// ============================================================================

const RATE_LIMIT_KEY = 'contact-form';
const MAX_SUBMISSIONS = 3;
const RATE_LIMIT_WINDOW = 300000; // 5 minutes

// ============================================================================
// Component
// ============================================================================

export function ContactForm({ className, onSuccess }: ContactFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const { status, isSubmitting, isSuccess, submit } = useFormSubmission();

  /**
   * Handle form submission with validation and security checks
   */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget;
      const formData = new FormData(form);

      // Security: Check honeypot field (bot detection)
      if (isHoneypotFilled(formData, 'website')) {
        // Silently reject bot submissions
        form.reset();
        return;
      }

      // Security: Check rate limiting
      const rateLimit = checkRateLimit(
        RATE_LIMIT_KEY,
        MAX_SUBMISSIONS,
        RATE_LIMIT_WINDOW,
      );
      if (!rateLimit.allowed) {
        const minutesRemaining = Math.ceil(rateLimit.resetInMs / 60000);
        setErrors({
          form: `Too many submissions. Please try again in ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}.`,
        });
        return;
      }

      // Extract, truncate, and sanitize form data
      const data: ContactFormInput = {
        name: sanitizeString(
          truncateInput(
            (formData.get('name') as string) || '',
            INPUT_LIMITS.NAME_MAX,
          ),
        ),
        email: sanitizeString(
          truncateInput(
            (formData.get('email') as string) || '',
            INPUT_LIMITS.EMAIL_MAX,
          ),
        ),
        message: sanitizeString(
          truncateInput(
            (formData.get('message') as string) || '',
            INPUT_LIMITS.MESSAGE_MAX,
          ),
        ),
      };

      // Validate form data
      const validation = validateContactForm(data);

      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Clear previous errors
      setErrors({});

      try {
        await submit(async () => {
          // Simulate API call - replace with actual API integration
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Call success callback if provided
          onSuccess?.(data);
        });

        // Reset form on success
        form.reset();
      } catch (error) {
        logError(error, 'ContactForm submission');
        setErrors({ form: 'Failed to send message. Please try again.' });
      }
    },
    [submit, onSuccess],
  );

  /**
   * Clear error when field is focused
   */
  const handleFieldFocus = useCallback((fieldName: keyof FormErrors) => {
    setErrors((prev) => {
      if (prev[fieldName]) {
        const { [fieldName]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  /**
   * Get button text based on current state
   */
  const getButtonText = (): string => {
    if (isSubmitting) return 'Sending...';
    if (isSuccess) return 'Message Sent!';
    return 'Send message';
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cx(
        'grid grid-cols-1 gap-6 border-secondary bg px-6 py-8 lg:rounded-md lg:border lg:px-8 lg:shadow-of-bg-surface xl:grid-cols-2',
        className,
      )}
      noValidate
      aria-label="Contact form"
    >
      <Input
        id="name"
        name="name"
        label="Name"
        placeholder="John Doe"
        autoComplete="name"
        aria-describedby={errors.name ? 'name-error' : undefined}
        aria-invalid={!!errors.name}
        onFocus={() => handleFieldFocus('name')}
        error={errors.name}
      />

      <Input
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="john.doe@example.com"
        autoComplete="email"
        aria-describedby={errors.email ? 'email-error' : undefined}
        aria-invalid={!!errors.email}
        onFocus={() => handleFieldFocus('email')}
        error={errors.email}
      />

      <TextArea
        id="message"
        name="message"
        label="Message"
        placeholder="How can we assist you?"
        className="xl:col-span-2"
        aria-describedby={errors.message ? 'message-error' : undefined}
        aria-invalid={!!errors.message}
        onFocus={() => handleFieldFocus('message')}
        error={errors.message}
      />

      {/* Honeypot field - hidden from users, catches bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Form-level error message */}
      {errors.form && (
        <p role="alert" className="text-red-500 text-body-sm xl:col-span-2">
          {errors.form}
        </p>
      )}

      <Button
        type="submit"
        className="my-[0.3125rem] xl:col-span-2"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {getButtonText()}
      </Button>

      {/* Screen reader announcement for form status */}
      <div className="sr-only" role="status" aria-live="polite">
        {isSuccess && 'Your message has been sent successfully.'}
        {status === 'error' && 'There was an error sending your message.'}
      </div>
    </form>
  );
}

export default ContactForm;
