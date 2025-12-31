import { cva, type VariantProps } from 'class-variance-authority';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

export const buttonStyles = cva(
  'flex items-center justify-center whitespace-nowrap rounded-md font-primary text-heading-xl font-medium focus-visible:outline-none',
  {
    variants: {
      variant: {
        primary:
          'ring-brand-hover bg-fill-brand text-on-bg-fill-brand ring-offset-2 hover:bg-fill-brand-hover hover:shadow-of-bg-fill-brand focus-visible:bg-fill-brand-hover focus-visible:shadow-of-bg-fill-brand focus-visible:ring',
        secondary:
          'ring-fill-hover bg-fill text-on-bg-fill ring-offset-2 hover:bg-fill-hover hover:shadow-of-bg-fill focus-visible:bg-fill-hover focus-visible:shadow-of-bg-fill focus-visible:ring',
        whatsapp:
          'bg-[#25D366] text-white ring-offset-2 hover:bg-[#20BA5A] hover:shadow-lg focus-visible:bg-[#20BA5A] focus-visible:shadow-lg focus-visible:ring focus-visible:ring-[#25D366]',
        instagram:
          'bg-[#C7797D] text-white ring-offset-2 hover:bg-[#B36A6E] hover:shadow-lg focus-visible:bg-[#B36A6E] focus-visible:shadow-lg focus-visible:ring focus-visible:ring-[#C7797D]',
        facebook:
          'bg-[#1877F2] text-white ring-offset-2 hover:bg-[#0C63D4] hover:shadow-lg focus-visible:bg-[#0C63D4] focus-visible:shadow-lg focus-visible:ring focus-visible:ring-[#1877F2]',
      },
      size: {
        medium: 'h-12 gap-2 px-6',
        large: 'h-14 gap-3 px-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'large',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  children: ReactNode;
}

export function Button({
  variant,
  size,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonStyles> {
  children: ReactNode;
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={buttonStyles({ variant, size, className })} {...props}>
      {children}
    </a>
  );
}

export default Button;
