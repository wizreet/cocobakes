import { Icon } from '@iconify/react';
import Logo from './Logo';
import contactInfo from '../../data/contact-info';
import openingHours from '../../data/opening-hours';

const footerData = {
  info: [contactInfo.phone, contactInfo.email],
  columns: [
    {
      title: 'Browse',
      list: [
        { href: '#menu', text: 'Menu' },
        { href: '#about', text: 'About' },
        { href: '#contact', text: 'Contact' },
      ],
    },
    {
      title: 'Connect',
      list: [
        { href: 'https://instagram.com/cocobakes.np', text: 'Instagram' },
        { href: 'https://facebook.com/cocobakes.np', text: 'Facebook' },
        { href: 'https://wa.me/9779849805290', text: 'WhatsApp' },
      ],
    },
    {
      title: 'Visit Us',
      list: [
        ...openingHours.map(({ days, hours }) => ({ text: `${days}: ${hours}` })),
        contactInfo.address,
      ],
    },
  ],
};

export function Footer() {
  return (
    <footer className="divide-y divide-primary bg-surface">
      <nav
        aria-label="footer"
        className="container flex flex-col gap-8 pb-8 pt-16 lg:flex-row lg:justify-between lg:pt-24"
      >
        <div className="flex flex-col gap-3 lg:gap-[2.349375rem]">
          <Logo className="w-fit" />
          <ul className="flex flex-col gap-1 lg:gap-2">
            {footerData.info.map(({ href, text }) => (
              <li key={text}>
                <a
                  href={href}
                  className="font-secondary text-body-md font-regular text-secondary hover:text hover:underline focus-visible:text focus-visible:underline"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {footerData.columns.map(({ title, list }) => (
          <div key={title} className="flex flex-col gap-3 lg:gap-6">
            <h3 className="font-primary text-heading-xl font-bold text-brand">
              {title}
            </h3>
            <ul className="flex flex-col gap-1 lg:gap-2">
              {list.map((item) => {
                const isExternal = 'href' in item && item.href?.startsWith('http');
                return (
                <li key={item.text}>
                  {'href' in item && item.href ? (
                    <a
                      href={item.href}
                      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                      className="font-secondary text-body-md font-regular text-secondary hover:text hover:underline focus-visible:text focus-visible:underline"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <p className="font-secondary text-body-md font-regular text-secondary">
                      {item.text}
                    </p>
                  )}
                </li>
              )})}
            </ul>
          </div>
        ))}
      </nav>
      <div className="container flex flex-col gap-1 pb-16 pt-8 lg:flex-row-reverse lg:justify-between lg:pb-24">
        <a
          href="#"
          className="w-fit font-secondary text-body-md font-regular text-secondary hover:text hover:underline focus-visible:text focus-visible:underline"
        >
          Privacy Policy
        </a>
        <p className="font-secondary text-body-md font-regular text-secondary">
          &copy; {new Date().getFullYear()} CocoBakes, Lalitpur. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
