import contactInfo from '@/data/contact-info';
import openingHours from '@/data/opening-hours';

const footer = {
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
        ...openingHours.map(({ days, hours }) => `${days}: ${hours}`),
        contactInfo.address,
      ],
    },
  ],
};

export default footer;
