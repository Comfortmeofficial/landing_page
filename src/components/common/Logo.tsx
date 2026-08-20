import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export function Logo({ className, light = false }: LogoProps) {
  return (
    <a href="/" className={cn('flex items-center gap-2', className)} aria-label="Comfortme home">
      {light ? (
        <img src="/logo-light.png" alt="Comfortme logo" className="h-8 w-auto" />
      ) : (
        <>
          <img src="/logo-dark.png" alt="Comfortme logo" className="h-8 w-auto dark:hidden" />
          <img src="/logo-light.png" alt="Comfortme logo" className="h-8 w-auto hidden dark:block" />
        </>
      )}
      <span
        className={cn(
          'text-xl font-bold tracking-tight',
          light ? 'text-white' : 'text-[#0B91F7] dark:text-white',
        )}
      >
        Comfort<span className="text-[#0B91F7]">Me</span>
      </span>
    </a>
  );
}
