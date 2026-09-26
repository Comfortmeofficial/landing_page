import axios from 'axios';
import type { WaitlistFormData, PolicyContent } from '@/types';

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
