// Holds the guest's checkout session (access/refresh tokens + user id) in
// sessionStorage, not localStorage — this is a one-off purchase session, not
// a deliberate account signup, so it shouldn't linger as a standing login
// once the tab closes. Cleared explicitly once a purchase completes too.
const KEY = 'comfortme_guest_session';

export interface GuestSession {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
}

export function saveGuestSession(session: GuestSession) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // sessionStorage unavailable (private mode) — the checkout flow still
    // works within the same in-memory React state, it just can't survive
    // the full-page redirect to Paystack and back.
  }
}

export function getGuestSession(): GuestSession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GuestSession) : null;
  } catch {
    return null;
  }
}

export function clearGuestSession() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // nothing to clean up if storage was never reachable
  }
}
