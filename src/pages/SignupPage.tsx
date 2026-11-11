import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { authApi } from '@/lib/api';
import { saveUserSession } from '@/lib/userSession';
import type { SignupForm } from '@/types';

const inputCls =
  'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition';

const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400';

function apiErrorMessage(err: unknown, fallback: string): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
}

type Step = 'details' | 'otp';

const emptyForm: SignupForm = { firstName: '', lastName: '', email: '', phone: '', password: '' };

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/account';

  const [step, setStep] = useState<Step>('details');
  const [form, setForm] = useState<SignupForm>(emptyForm);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.signup(form);
      // Account exists but is unverified until the OTP below is confirmed
      // — same order the mobile app's signup screen uses.
      await authApi.sendSignupOtp(form.email);
      setStep('otp');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create your account. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await authApi.verifySignupOtp(form.email, otp.trim());
      saveUserSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        userId: tokens.user_id,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not verify that code. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-white dark:bg-gray-900 pt-28 pb-24">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-50 dark:bg-secondary-900/20">
              <UserPlus size={24} className="text-secondary-500" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Create your account
            </h1>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Save your details once — book your next trip in a couple of taps.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-8 shadow-sm">
            {step === 'details' ? (
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>First Name</label>
                    <input
                      className={inputCls}
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input
                      className={inputCls}
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input
                    type="email"
                    className={inputCls}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input
                    type="tel"
                    className={inputCls}
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Password</label>
                  <input
                    type="password"
                    className={inputCls}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    minLength={8}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We've sent a 6-digit code to{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">{form.email}</span>.
                </p>
                <div>
                  <label className={labelCls}>Verification Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Verifying…' : 'Verify and continue'}
                </Button>
                <button
                  type="button"
                  onClick={() => authApi.sendSignupOtp(form.email)}
                  className="w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Resend code
                </button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-secondary-500 hover:text-secondary-600">
              Log in
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
