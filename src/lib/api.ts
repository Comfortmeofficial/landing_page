import axios from 'axios';
import type {
  Destination,
  GuestCheckoutForm,
  GuestSessionResponse,
  Location,
  PayBookingResult,
  PaymentMethod,
  PaystackVerifyResult,
  PolicyContent,
  Ride,
  RideSeat,
  WaitlistFormData,
} from '@/types';
import { getGuestSession } from './guestSession';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

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
  getLocations: () => api.get<Location[]>('/api/v1/locations').then((r) => r.data),
  getDestinations: () => api.get<Destination[]>('/api/v1/destinations').then((r) => r.data),
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
