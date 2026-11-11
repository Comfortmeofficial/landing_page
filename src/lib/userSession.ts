// Holds a real (password) account's session — localStorage, not
// sessionStorage, because unlike a guest checkout session (see
// guestSession.ts) this one is a deliberate login meant to survive a closed
// tab. Also caches the profile fields BookPage needs to skip re-asking a
// logged-in user for their name/email/phone on every booking.
const KEY = 'comfortme_user_session';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface UserSession extends UserProfile {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

export function saveUserSession(session: UserSession) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable (private mode, storage full) — login still
    // works for the current page load via in-memory React state, it just
    // won't survive a refresh.
  }
}

export function getUserSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UserSession) : null;
  } catch {
    return null;
  }
}

export function clearUserSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to clean up if storage was never reachable
  }
}
