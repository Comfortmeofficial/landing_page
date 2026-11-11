import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { authApi, userApi } from '@/lib/api';
import { saveUserSession } from '@/lib/userSession';

const inputCls =
  'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition';

const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400';

function apiErrorMessage(err: unknown, fallback: string): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
}

function isUnverifiedError(err: unknown): boolean {
  // login() throws this exact 403 for one reason only: the account was
  // created but never finished OTP verification. Checked by status, not by
  // matching the detail string, so this can't silently stop firing if the
  // wording changes later.
  return (err as { response?: { status?: number } })?.response?.status === 403;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Someone who signed up but abandoned the site before entering their
  // verification code lands here otherwise with no way forward — login
  // correctly refuses them, but nothing on this page previously let them
  // pick up where they left off short of going back through signup and
  // hitting "Email already in use".
  const [needsVerification, setNeedsVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  // BookPage sends people here with `state: { from: '/book' }` when they
  // click "Log in" mid-checkout, so a login from there returns them to
  // finish booking instead of stranding them on this page.
  const from = (location.state as { from?: string } | null)?.from ?? '/account';

  async function finishLogin(tokens: { access_token: string; refresh_token: string; user_id: number }) {
    const profile = await userApi.getByEmail(email.trim());
    saveUserSession({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      userId: tokens.user_id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
      phone: profile.phone ?? '',
    });
    navigate(from, { replace: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await authApi.login(email.trim(), password);
      await finishLogin(tokens);
    } catch (err) {
      if (isUnverifiedError(err)) {
        setNeedsVerification(true);
        authApi.sendSignupOtp(email.trim()).catch(() => {
          // handleResendOtp's own "Resend" button covers a failed send here
        });
        return;
      }
      setError(apiErrorMessage(err, 'Could not sign you in. Check your email and password.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setOtpError(null);
    setOtpLoading(true);
    try {
      const tokens = await authApi.verifySignupOtp(email.trim(), otp.trim());
      await finishLogin(tokens);
    } catch (err) {
      setOtpError(apiErrorMessage(err, 'Could not verify that code. Please try again.'));
    } finally {
      setOtpLoading(false);
    }
  }

  return (
    <main className="bg-white dark:bg-gray-900 pt-28 pb-24">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-50 dark:bg-secondary-900/20">
              <LogIn size={24} className="text-secondary-500" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {needsVerification ? 'Verify your email' : 'Welcome back'}
            </h1>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {needsVerification
                ? `We've sent a code to ${email.trim()} to finish setting up your account.`
                : 'Log in to book without retyping your details every time.'}
            </p>
          </div>

          {needsVerification ? (
            <form
              onSubmit={handleVerify}
              className="space-y-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-8 shadow-sm"
            >
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
              {otpError && <p className="text-sm text-red-600 dark:text-red-400">{otpError}</p>}
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={otpLoading}>
                {otpLoading ? 'Verifying…' : 'Verify and continue'}
              </Button>
              <button
                type="button"
                onClick={() => authApi.sendSignupOtp(email.trim())}
                className="w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                Resend code
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-8 shadow-sm"
            >
              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                {loading ? 'Signing in…' : 'Log in'}
              </Button>
            </form>
          )}

          {!needsVerification && (
            <>
              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-secondary-500 hover:text-secondary-600">
                  Sign up
                </Link>
              </p>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Just here for one trip?{' '}
                <Link to="/book" className="font-semibold text-secondary-500 hover:text-secondary-600">
                  Book as a guest
                </Link>
              </p>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
