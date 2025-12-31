import { cx } from 'class-variance-authority';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export function Input({
  id,
  label,
  type = 'text',
  required = true,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-primary text-heading-xl font-bold text-brand">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className={cx(
          'focus-visible:border-brand-hover ring-brand-hover h-14 rounded-md border border-primary bg-surface px-3 font-secondary text-body-md font-regular text placeholder:text-secondary/50 focus-visible:outline-none focus-visible:ring-1',
          className
        )}
        {...props}
      />
    </div>
  );
}

export default Input;
