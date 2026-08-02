import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#ffd600" />
        <stop offset="25%" stopColor="#ff6930" />
        <stop offset="50%" stopColor="#fe3b8f" />
        <stop offset="75%" stopColor="#c837ab" />
        <stop offset="100%" stopColor="#7b2ff7" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" fill="url(#ig-grad)" />
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
    <circle cx="17" cy="7" r="1.2" fill="white" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.262 5.636 5.902-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" />
  </svg>
);

const socials = [
  { icon: <InstagramIcon />, label: 'FOLLOW US ON INSTAGRAM', handle: 'official@Comfortme', href: '#' },
  { icon: <XIcon />, label: 'FOLLOW US ON X', handle: 'official@Comfortme', href: '#' },
  { icon: <TikTokIcon />, label: 'FOLLOW US ON TIKTOK', handle: 'official@Comfortme', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr_1fr_2fr]">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 max-w-xs">
              ComfortMe is a technology-enabled transport and mobility company focused on improving
              urban commuting through digital ride scheduling, seat reservations, subscription-based
              transportation, fleet management, and corporate mobility solutions designed for
              convenience, reliability, comfort, and operational efficiency.
            </p>
          </div>

          {/* Policies */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900 dark:text-white">
              Policies
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Terms and Condition
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-900 dark:text-white">
              Resources
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="/#faq" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  FAQ's
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex flex-col items-center gap-2 text-center group"
                  aria-label={s.label}
                >
                  <span className="text-gray-700 dark:text-gray-200 group-hover:opacity-80 transition-opacity">
                    {s.icon}
                  </span>
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {s.label.replace('FOLLOW US ON ', 'FOLLOW US ON\n')}
                  </span>
                  <span className="text-xs text-secondary dark:text-secondary-400">{s.handle}</span>
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-right leading-relaxed">
              Stay connected for updates, launch news, insights, and everything shaping the future of everyday mobility.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            © 2026 Comfort Me. Comfort and Structure in every move
          </p>
        </div>
      </div>
    </footer>
  );
}
