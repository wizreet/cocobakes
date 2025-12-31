import { cx } from 'class-variance-authority';
import { type AnchorHTMLAttributes } from 'react';

interface LogoProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'text' | 'image' | 'circular';
  showText?: boolean;
}

export function Logo({ 
  href = import.meta.env.BASE_URL || '/', 
  className, 
  variant = 'text',
  showText = false,
  ...props 
}: LogoProps) {
  const basePath = import.meta.env.BASE_URL || '/';
  
  if (variant === 'circular') {
    return (
      <a href={href} className={cx('block', className)} {...props}>
        <img 
          src={`${basePath}LogoCircular.jpeg`}
          alt="CocoBakes" 
          className="h-12 w-12 rounded-full object-cover lg:h-16 lg:w-16"
        />
      </a>
    );
  }

  if (variant === 'image') {
    return (
      <a href={href} className={cx('block', className)} {...props}>
        <img 
          src={`${basePath}LogoNoText.jpeg`}
          alt="CocoBakes" 
          className="h-10 w-auto lg:h-14"
        />
        {showText && (
          <span className="font-brand text-heading-xl text-brand lg:text-heading-2xl">
            CocoBakes
          </span>
        )}
      </a>
    );
  }

  // Default text variant with brand font
  return (
    <a
      href={href}
      className={cx(
        'ring-brand-hover flex items-center gap-2 rounded-md font-brand text-heading-2xl text-brand ring-offset-2 hover:text-brand-hover focus-visible:text-brand-hover focus-visible:outline-none focus-visible:ring lg:text-heading-4xl',
        className
      )}
      {...props}
    >
      <img 
        src="/LogoCircular.jpeg" 
        alt="" 
        className="h-8 w-8 rounded-full object-cover lg:h-10 lg:w-10"
      />
      <span>CocoBakes</span>
    </a>
  );
}

export default Logo;
