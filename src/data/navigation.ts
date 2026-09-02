import type { NavLink } from '@/types';

// The leading "/" matters: Header renders on every route, and a bare
// "#features" resolves against whatever page you're already on (e.g.
// /contact#features, which has no such element) rather than Home.
export const navLinks: NavLink[] = [
  { label: 'Features', href: '/#features' },
  { label: 'Experience', href: '/#benefits' },
  { label: 'Steps', href: '/#how-it-works' },
  { label: 'Rental', href: '/#rental' },
];
