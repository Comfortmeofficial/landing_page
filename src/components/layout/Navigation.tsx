import { cn } from '@/lib/utils';
import type { NavLink } from '@/types';

interface NavigationProps {
  links: NavLink[];
  mobile?: boolean;
  onLinkClick?: () => void;
  dark?: boolean;
}

export function Navigation({ links, mobile = false, onLinkClick, dark = false }: NavigationProps) {
  return (
    <nav aria-label="Main navigation">
      <ul
        className={cn(
          'flex',
          mobile ? 'flex-col gap-1' : 'flex-row items-center gap-8',
        )}
      >
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                'text-sm font-medium transition-colors duration-150',
                mobile && 'block rounded-lg px-3 py-2',
                dark
                  ? 'text-white hover:text-white/70'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
