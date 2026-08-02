import type { NavLink, FooterColumn } from '@/types';

export const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Experience', href: '#benefits' },
  { label: 'Steps', href: '#how-it-works' },
  { label: 'Rental', href: '#rental' },
];

export const footerColumns: FooterColumn[] = [
  {
    heading: 'PRODUCT',
    links: [
      { label: 'Experience', href: '#benefits' },
      { label: 'Safety', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
  },
  {
    heading: 'COMPANY',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    heading: 'LEGAL',
    links: [
      { label: 'Terms', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
];
