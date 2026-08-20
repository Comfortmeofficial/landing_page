import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/utils';

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn(centered && 'text-center', className)}
    >
      <h2
        className={cn(
          'text-3xl font-bold tracking-tight sm:text-4xl',
          light ? 'text-white' : 'text-gray-900 dark:text-white',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-lg leading-relaxed',
            light
              ? 'text-white/70'
              : 'text-gray-500 dark:text-gray-400',
            centered && 'mx-auto max-w-2xl',
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
