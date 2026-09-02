import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { Navigation } from '@/components/layout/Navigation';
import { navLinks } from '@/data/navigation';
import { useDarkMode } from '@/hooks/useDarkMode';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />

            <div className="hidden md:flex md:items-center md:gap-8">
              <Navigation links={navLinks} />
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="relative group">
                <button
                  onClick={toggle}
                  aria-label="Toggle dark mode"
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-100 px-2.5 py-1 text-xs text-white dark:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
                  {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                </span>
              </div>
              <Button variant="primary" size="md">
                <a href="/#contact">Download the App</a>
              </Button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <div className="relative group">
                <button
                  onClick={toggle}
                  aria-label="Toggle dark mode"
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <span className="pointer-events-none absolute top-full right-0 mt-2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-100 px-2.5 py-1 text-xs text-white dark:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
                  {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-white dark:bg-gray-900 px-4 pt-6 pb-8 md:hidden"
          >
            <Navigation links={navLinks} mobile onLinkClick={() => setIsOpen(false)} />
            <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <Button variant="primary" size="lg" fullWidth>
                <a href="/#contact" onClick={() => setIsOpen(false)}>Download the App</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
