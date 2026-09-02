import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Header renders on every route and its nav links are plain `#section`
// anchors, so a link like #features only means something on Home — clicked
// from /contact or /terms it's a plain same-page anchor with nothing to
// find. Those links (and the footer's /#faq) instead point at the path
// carrying the hash, so this runs on every navigation and either scrolls to
// the hash target once it's on the page, or to the top when there isn't one.
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.slice(1);
    // The target section may not have laid out yet on the very first paint
    // of a fresh navigation into this route — retry across a few frames
    // rather than a fixed guessed delay.
    let cancelled = false;
    let frame = 0;
    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (frame < 20) {
        frame += 1;
        requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();
    return () => { cancelled = true; };
  }, [pathname, hash]);

  return null;
}
