/**
 * Footer Component
 * Site footer with contact info, navigation, and social links
 */

import { memo, useMemo } from 'react';
import Logo from './Logo';
import contactInfo from '../../data/contact-info';
import openingHours from '../../data/opening-hours';
import { SOCIAL_URLS, BUSINESS, BASE_PATH } from '@/constants';
import type { FooterColumn, ContactLink } from '@/types';

// ============================================================================
// Component
// ============================================================================

export const Footer = memo(function Footer() {
  /**
   * Footer data configuration
   * Memoized to prevent recalculation on re-renders
   */
  const footerData = useMemo(
    () => ({
      info: [contactInfo.phone, contactInfo.email] as readonly ContactLink[],
      columns: [
        {
          title: 'Browse',
          list: [
            { href: `${BASE_PATH}menu`, text: 'Menu' },
            { href: `${BASE_PATH}#about`, text: 'About' },
            { href: `${BASE_PATH}#contact`, text: 'Contact' },
          ],
        },
        {
          title: 'Connect',
          list: [
            { href: SOCIAL_URLS.INSTAGRAM, text: 'Instagram' },
            { href: SOCIAL_URLS.FACEBOOK, text: 'Facebook' },
            { href: SOCIAL_URLS.WHATSAPP, text: 'WhatsApp' },
          ],
        },
        {
          title: 'Visit Us',
          list: [
            ...openingHours.map(({ days, hours }) => ({
              text: `${days}: ${hours}`,
            })),
            contactInfo.address,
          ],
        },
      ] as readonly FooterColumn[],
    }),
    [],
  );

  /**
   * Get current year for copyright
   */
  const currentYear = new Date().getFullYear();

  return (
    <footer className="divide-y divide-primary bg-surface">
      <nav
        aria-label="Footer navigation"
        className="container flex flex-col gap-8 pb-8 pt-16 lg:flex-row lg:justify-between lg:pt-24"
      >
        {/* Logo and Contact Info */}
        <div className="flex flex-col gap-3 lg:gap-[2.349375rem]">
          <Logo className="w-fit" />
          <ul className="flex flex-col gap-1 lg:gap-2">
            {footerData.info.map(({ href, text }) => (
              <li key={text}>
                <a
                  href={href}
                  className="font-secondary text-body-md font-regular text-secondary hover:text hover:underline focus-visible:text focus-visible:underline focus-visible:outline-none"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Columns */}
        {footerData.columns.map(({ title, list }) => (
          <div key={title} className="flex flex-col gap-3 lg:gap-6">
            <h3 className="font-primary text-heading-xl font-bold text-brand">
              {title}
            </h3>
            <ul className="flex flex-col gap-1 lg:gap-2">
              {list.map((item) => {
                const isExternal =
                  'href' in item && item.href?.startsWith('http');
                return (
                  <li key={item.text}>
                    {'href' in item && item.href ? (
                      <a
                        href={item.href}
                        {...(isExternal && {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        })}
                        className="font-secondary text-body-md font-regular text-secondary hover:text hover:underline focus-visible:text focus-visible:underline focus-visible:outline-none"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p className="font-secondary text-body-md font-regular text-secondary">
                        {item.text}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Copyright and Legal */}
      <div className="container flex flex-col gap-1 pb-16 pt-8 lg:flex-row-reverse lg:justify-between lg:pb-24">
        <a
          href={`${BASE_PATH}privacy`}
          className="w-fit font-secondary text-body-md font-regular text-secondary hover:text hover:underline focus-visible:text focus-visible:underline focus-visible:outline-none"
        >
          Privacy Policy
        </a>
        <p className="font-secondary text-body-md font-regular text-secondary">
          &copy; {currentYear} {BUSINESS.NAME}, {BUSINESS.LOCATION}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
});

export default Footer;
