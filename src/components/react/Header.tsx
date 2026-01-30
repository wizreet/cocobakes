/**
 * Header Component
 * Responsive navigation header with mobile menu and scroll effects
 */

import { useCallback, memo } from 'react';
import { cx } from 'class-variance-authority';
import { Icon } from '@iconify/react';
import Logo from './Logo';
import NavLink from './NavLink';
import { ButtonLink } from './Button';
import contactInfo from '../../data/contact-info';
import { NAV_LINKS, SOCIAL_URLS, ICONS, BASE_PATH } from '@/constants';
import {
  useScrollEffect,
  useBodyScrollLock,
  useToggle,
  useKeyPress,
} from '@/hooks';

// ============================================================================
// Types
// ============================================================================

interface NavLinkItem {
  readonly href: string;
  readonly text: string;
  readonly icon: string;
}

// ============================================================================
// Constants
// ============================================================================

const navLinks: readonly NavLinkItem[] = NAV_LINKS;

const socialLinks = [
  { href: SOCIAL_URLS.INSTAGRAM, text: 'Instagram', icon: ICONS.INSTAGRAM },
  { href: SOCIAL_URLS.FACEBOOK, text: 'Facebook', icon: ICONS.FACEBOOK },
  { href: SOCIAL_URLS.WHATSAPP, text: 'WhatsApp', icon: ICONS.WHATSAPP },
] as const;

// ============================================================================
// Component
// ============================================================================

export const Header = memo(function Header() {
  const [isMenuOpen, toggleMenu, setIsMenuOpen] = useToggle(false);
  const headerStyle = useScrollEffect();

  // Lock body scroll when menu is open
  useBodyScrollLock(isMenuOpen);

  // Close menu on Escape key
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  useKeyPress('Escape', closeMenu);

  return (
    <>
      {/* Header */}
      <header
        className={cx(
          'fixed left-0 right-0 top-0 z-30 transition-all duration-200',
          isMenuOpen && '-translate-x-72',
        )}
        style={{
          paddingTop: headerStyle.padding,
          paddingBottom: headerStyle.padding,
        }}
      >
        {/* Background overlay */}
        <div
          className="absolute inset-0 -z-10 border-b border-secondary bg-surface transition-opacity"
          style={{ opacity: headerStyle.opacity }}
          aria-hidden="true"
        />

        <div className="container flex items-center justify-between">
          <Logo />
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 lg:flex xl:gap-10"
          >
            <NavLink href={BASE_PATH}>Home</NavLink>
            <NavLink href={`${BASE_PATH}menu`}>Menu</NavLink>
            <NavLink href={`${BASE_PATH}craft`}>Craft</NavLink>
            <NavLink href={`${BASE_PATH}gallery`}>Gallery</NavLink>
            <NavLink href={`${BASE_PATH}offers`}>Offers</NavLink>
            <ButtonLink href={`${BASE_PATH}#contact`} size="medium">
              <span>Contact</span>
              <Icon
                icon={ICONS.ARROW_RIGHT}
                className="h-5 w-5"
                aria-hidden="true"
              />
            </ButtonLink>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
            className="group relative z-50 flex h-10 w-10 items-center justify-center rounded-md text-brand hover:bg-surface lg:hidden"
          >
            <Icon
              icon={isMenuOpen ? ICONS.CLOSE : ICONS.MENU}
              className="h-7 w-7"
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-20 backdrop-blur-md"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <nav
        id="mobile-menu"
        role="menu"
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
        className={cx(
          'fixed bottom-0 right-0 top-0 z-40 flex w-72 flex-col justify-between bg-fill-brand-hover transition-transform duration-300',
          isMenuOpen ? 'translate-x-0' : 'translate-x-72',
        )}
      >
        <header className="flex justify-center px-6 py-8">
          <Logo className="text-on-bg-fill-brand" />
        </header>
        <div>
          {navLinks.map(({ href, text, icon }, index) => (
            <a
              key={href}
              href={href}
              role="menuitem"
              onClick={closeMenu}
              className={cx(
                'flex gap-6 border-b border-brand p-6 font-primary text-heading-xl font-regular text-on-bg-fill-brand',
                index === 0 && 'border-y bg-fill-brand',
              )}
            >
              <Icon
                icon={icon}
                className="h-6 w-6 text-on-bg-fill-brand-secondary"
                aria-hidden="true"
              />
              {text}
            </a>
          ))}
        </div>
        <footer className="flex flex-col items-center gap-4 px-6 py-8">
          <div className="flex gap-4">
            {socialLinks.map(({ href, text, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-fill-brand text-on-bg-fill-brand transition-colors hover:bg-fill"
                aria-label={`Visit us on ${text}`}
              >
                <Icon icon={icon} className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
          <a
            href={contactInfo.phone.href}
            className="font-secondary font-regular text-on-bg-fill-brand underline"
          >
            {contactInfo.phone.text}
          </a>
        </footer>
      </nav>
    </>
  );
});

export default Header;
