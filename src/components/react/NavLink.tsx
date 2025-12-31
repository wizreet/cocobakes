import { cx } from 'class-variance-authority';
import { type AnchorHTMLAttributes, type ReactNode, useState, useEffect } from 'react';

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export function NavLink({ className, href, children, ...props }: NavLinkProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkActive = () => {
      if (!href) return;
      
      if (href === '#' || href === '/') {
        // Home link - active when at top or no hash
        setIsActive(window.location.hash === '' || window.location.hash === '#');
      } else if (href.startsWith('#')) {
        // Hash link - active when hash matches
        setIsActive(window.location.hash === href);
      } else if (href.includes('#')) {
        // Path + hash link - active when both match
        const [path, hash] = href.split('#');
        setIsActive(window.location.pathname === path && window.location.hash === `#${hash}`);
      } else {
        // Path link - active when pathname matches
        setIsActive(window.location.pathname === href);
      }
    };

    checkActive();
    window.addEventListener('hashchange', checkActive);
    window.addEventListener('scroll', checkActive);
    
    return () => {
      window.removeEventListener('hashchange', checkActive);
      window.removeEventListener('scroll', checkActive);
    };
  }, [href]);

  return (
    <a
      href={href}
      className={cx(
        'decoration-current font-primary text-heading-xl font-regular transition-colors',
        isActive 
          ? 'text-fill-brand font-semibold' 
          : 'text hover:text-brand-hover focus-visible:text-brand-hover',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export default NavLink;
