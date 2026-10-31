import axios from 'axios';
import type {
  Booking,
  GuestCheckoutForm,
  GuestSessionResponse,
  PayBookingResult,
  PaymentMethod,
  PaystackVerifyResult,
  PolicyContent,
  Ride,
  RideSeat,
  Route,
  WaitlistFormData,
} from '@/types';
import { clearGuestSession, getGuestSession, saveGuestSession } from './guestSession';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

// The guest's access token is short-lived (15 minutes) — fine for a normal
// checkout, but someone who steps away mid-flow and comes back would
// otherwise hit a 401 on whatever they do next with no way to recover
// short of starting over. Mirrors customer_mobile_app's own refresh-on-401
// interceptor: only acts on a request that actually carried a guest
// session's Authorization header (so it never touches the public endpoints
// — waitlist, policies, account deletion — this same client also serves),
// and only retries once per request to avoid looping on a truly dead
// refresh token.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const hadAuthHeader = !!original?.headers?.Authorization;
    if (error.response?.status === 401 && hadAuthHeader && !original._retry) {
      original._retry = true;
      const session = getGuestSession();
      if (session) {
        try {
          const { data } = await axios.post(`${api.defaults.baseURL}/api/v1/auth/refresh`, {
            refresh_token: session.refreshToken,
          });
          const tokens = data.data as { access_token: string; refresh_token: string };
          saveGuestSession({ ...session, accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
          original.headers.Authorization = `Bearer ${tokens.access_token}`;
          return api(original);
        } catch {
          clearGuestSession();
        }
      }
    }
    return Promise.reject(error);
  },
);

export const policyApi = {
  getPrivacy: () => api.get<PolicyContent>('/api/v1/policies/privacy'),
  getTerms: () => api.get<PolicyContent>('/api/v1/policies/terms'),
};

export const waitlistApi = {
  join: (data: WaitlistFormData) =>
    api.post('/api/v1/auth/waitlist', {
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      occupation: data.occupation,
      commute_days: data.commuteDays,
      challenge: data.challenge,
      preference: data.preference || 'pay-per-ride',
    }),
};

// Lets someone delete their Comfortme account from the website, without
// installing the app or logging in — proving control of the account's email
// via a one-time code is the identity check.
export const accountDeletionApi = {
  requestCode: (email: string) =>
    api.post('/api/v1/auth/send-otp', { email, purpose: 'account_deletion' }),
  confirm: (email: string, otp: string) =>
    api.post('/api/v1/auth/delete-account', { email, otp }),
};

// ─── Guest ticket purchase ──────────────────────────────────────────────

export const routesApi = {
  // Active, real location->destination pairs to browse/search through, as
  // opposed to picking a pickup and a destination independently — this is
  // GET /api/v1/routes, not derived from separate locations/destinations
  // listings.
  getRoutes: () =>
    api.get<Route[]>('/api/v1/routes', { params: { status: 'active', limit: 200 } }).then((r) => r.data),
};

export const bookingApi = {
  search: (payload: { location?: string; destination: string }) =>
    api.post<Ride[]>('/api/v1/search', payload).then((r) => r.data),
  getRide: (id: number) => api.get<Ride>(`/api/v1/rides/${id}`).then((r) => r.data),
  getSeats: (rideId: number) => api.get<RideSeat[]>(`/api/v1/rides/${rideId}/seats`).then((r) => r.data),
};

// Issues the guest a real (if passwordless) session the same way login
// does — every call below this point attaches it as a Bearer header, same
// as the mobile app attaches its own login session.
export const guestAuthApi = {
  start: (data: GuestCheckoutForm) =>
    api
      .post<GuestSessionResponse>('/api/v1/auth/guest', {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
      })
      .then((r) => r.data),
  requestCode: (email: string) =>
    api.post('/api/v1/auth/send-otp', { email, purpose: 'guest_checkout_verify' }),
  verify: (email: string, otp: string) =>
    api.post<GuestSessionResponse>('/api/v1/auth/guest/verify', { email, otp }).then((r) => r.data),
};

// authHeader() is passed explicitly per-call (not a global interceptor on
// `api`) so the guest's token only ever goes out on the booking/payment
// calls that actually need it, never on the unrelated public endpoints
// (waitlist, policies, account deletion) this same client also serves.
function authHeader(): Record<string, string> {
  const session = getGuestSession();
  return session ? { Authorization: `Bearer ${session.accessToken}` } : {};
}

export const paymentApi = {
  payBooking: (payload: {
    user_id: number;
    email: string;
    ride_id: number;
    seat_numbers: string[];
    pickup_stop_id?: number | null;
    amount: number;
    payment_method: PaymentMethod;
    callback_url: string;
  }) =>
    api
      .post<PayBookingResult>('/api/v1/payment-hub/pay-booking', payload, { headers: authHeader() })
      .then((r) => r.data),
  verify: (reference: string) =>
    api
      .post<PaystackVerifyResult>(`/api/v1/payment-hub/verify/${reference}`, undefined, { headers: authHeader() })
      .then((r) => r.data),
};

// Looking up a ticket later needs no login — the group reference from the
// confirmation email (or the payment reference, which is the same value;
// every booking created in one purchase shares it as its group_reference)
// is itself the unguessable, bearer-token-like credential. Public endpoint,
// no Authorization header.
export const ticketApi = {
  getByReference: (reference: string) =>
    api.get<Booking[]>(`/api/v1/bookings/group/${reference}`).then((r) => r.data),
};
