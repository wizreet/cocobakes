import { useState, useEffect, useCallback } from 'react';
import { cx } from 'class-variance-authority';
import { Icon } from '@iconify/react';
import Logo from './Logo';
import NavLink from './NavLink';
import { ButtonLink } from './Button';
import contactInfo from '../../data/contact-info';

const basePath = import.meta.env.BASE_URL || '/';

const navLinks = [
  { href: `${basePath}`, text: 'Home', icon: 'heroicons:home-solid' },
  { href: `${basePath}menu`, text: 'Menu', icon: 'heroicons:cake-solid' },
  { href: `${basePath}craft`, text: 'Craft Your Own', icon: 'heroicons:sparkles-solid' },
  { href: `${basePath}gallery`, text: 'Gallery', icon: 'heroicons:photo-solid' },
  { href: `${basePath}#contact`, text: 'Contact', icon: 'heroicons:information-circle-solid' },
];

const socialLinks = [
  { href: 'https://instagram.com/cocobakes.np', text: 'Instagram', icon: 'mdi:instagram' },
  { href: 'https://facebook.com/cocobakes.np', text: 'Facebook', icon: 'mdi:facebook' },
  { href: 'https://wa.me/9779849805290', text: 'WhatsApp', icon: 'mdi:whatsapp' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerStyle, setHeaderStyle] = useState({ padding: '2rem', opacity: 0 });

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 100;
      const progress = Math.min(scrollY / maxScroll, 1);
      
      const initialPadding = window.innerWidth >= 1024 ? 48 : 32;
      const scrolledPadding = 32;
      const padding = initialPadding - (initialPadding - scrolledPadding) * progress;
      
      setHeaderStyle({
        padding: `${padding / 16}rem`,
        opacity: progress,
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Header */}
      <header
        className={cx(
          'fixed left-0 right-0 top-0 z-30 transition-all duration-200',
          isMenuOpen && '-translate-x-72'
        )}
        style={{ paddingTop: headerStyle.padding, paddingBottom: headerStyle.padding }}
      >
        {/* Background overlay */}
        <div
          className="absolute inset-0 -z-10 border-b border-secondary bg-surface transition-opacity"
          style={{ opacity: headerStyle.opacity }}
        />
        
        <div className="container flex items-center justify-between">
          <Logo />
          <nav aria-label="main" className="hidden items-center gap-8 lg:flex xl:gap-10">
            <NavLink href={basePath}>Home</NavLink>
            <NavLink href={`${basePath}menu`}>Menu</NavLink>
            <NavLink href={`${basePath}craft`}>Craft</NavLink>
            <NavLink href={`${basePath}gallery`}>Gallery</NavLink>
            <ButtonLink href={`${basePath}#contact`} size="medium">
              <span>Contact</span>
              <Icon icon="heroicons:arrow-long-right-20-solid" className="h-5 w-5" />
            </ButtonLink>
          </nav>
          
          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="menu button"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
            className="group relative z-50 text lg:hidden"
          >
            {isMenuOpen ? (
              <Icon icon="heroicons:x-mark-solid" className="h-6 w-6" />
            ) : (
              <Icon icon="heroicons:bars-3-20-solid" className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-20 backdrop-blur-md"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        role="menu"
        aria-hidden={!isMenuOpen}
        className={cx(
          'fixed bottom-0 right-0 top-0 z-40 flex w-72 flex-col justify-between bg-fill-brand-hover transition-transform duration-300',
          isMenuOpen ? 'translate-x-0' : 'translate-x-72'
        )}
      >
        <header className="flex justify-center px-6 py-8">
          <Logo className="text-on-bg-fill-brand" />
        </header>
        <nav aria-label="main">
          {navLinks.map(({ href, text, icon }, index) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className={cx(
                'flex gap-6 border-b border-brand p-6 font-primary text-heading-xl font-regular text-on-bg-fill-brand',
                index === 0 && 'border-y bg-fill-brand'
              )}
            >
              <Icon icon={icon} className="text-on-bg-fill-brand-secondary h-6 w-6" />
              {text}
            </a>
          ))}
        </nav>
        <footer className="flex flex-col items-center gap-4 px-6 py-8">
          <div className="flex gap-4">
            {socialLinks.map(({ href, text, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-fill-brand text-on-bg-fill-brand transition-colors hover:bg-fill"
                aria-label={text}
              >
                <Icon icon={icon} className="h-5 w-5" />
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
      </div>
    </>
  );
}

export default Header;
