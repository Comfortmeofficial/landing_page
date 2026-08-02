import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export function Logo({ className, light = false }: LogoProps) {
  return (
    <a href="/" className={cn('flex items-center gap-2', className)} aria-label="Comfort Me home">
      {light ? (
        <img src="/logo-light.png" alt="Comfort Me logo" className="h-8 w-auto" />
      ) : (
        <>
          <img src="/logo-dark.png" alt="Comfort Me logo" className="h-8 w-auto dark:hidden" />
          <img src="/logo-light.png" alt="Comfort Me logo" className="h-8 w-auto hidden dark:block" />
        </>
      )}
      <span
        className={cn(
          'text-xl font-bold tracking-tight',
          light ? 'text-white' : 'text-gray-900 dark:text-white',
        )}
      >
        Comfort<span className="text-secondary">Me</span>
      </span>
    </a>
  );
}
