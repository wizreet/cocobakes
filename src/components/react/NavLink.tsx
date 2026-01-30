import { cx } from 'class-variance-authority';
import { type AnchorHTMLAttributes, type ReactNode, useState, useEffect } from 'react';
import { BASE_PATH } from '@/constants';

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export function NavLink({ className, href, children, ...props }: NavLinkProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkActive = () => {
      if (!href) return;
      
      const pathname = window.location.pathname;
      
      // Home link - check for base path or base path with trailing slash
      if (href === BASE_PATH || href === `${BASE_PATH}/` || href === '/') {
        const isHome = pathname === BASE_PATH || 
                       pathname === `${BASE_PATH}/` || 
                       pathname === '/' ||
                       pathname === `${BASE_PATH}index.html`;
        setIsActive(isHome && !window.location.hash);
      } else if (href.startsWith('#')) {
        // Hash link - active when hash matches
        setIsActive(window.location.hash === href);
      } else if (href.includes('#')) {
        // Path + hash link - active when both match
        const [path, hash] = href.split('#');
        const pathMatches = pathname === path || pathname === `${path}/` || pathname === `${path}index.html`;
        setIsActive(pathMatches && window.location.hash === `#${hash}`);
      } else {
        // Path link - active when pathname matches (with or without trailing slash)
        const normalizedHref = href.endsWith('/') ? href.slice(0, -1) : href;
        const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
        setIsActive(normalizedPath === normalizedHref || pathname === `${normalizedHref}/index.html`);
      }
    };

    checkActive();
    window.addEventListener('hashchange', checkActive);
    window.addEventListener('popstate', checkActive);
    
    return () => {
      window.removeEventListener('hashchange', checkActive);
      window.removeEventListener('popstate', checkActive);
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
