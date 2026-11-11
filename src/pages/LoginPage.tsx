import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { PasswordInput } from '@/components/common/PasswordInput';
import { authApi, userApi } from '@/lib/api';
import { saveUserSession } from '@/lib/userSession';
import { authInputCls, authLabelCls, authButtonCls } from '@/lib/authStyles';

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
    <main className="bg-white dark:bg-gray-900 pt-24 pb-24 min-h-screen">
      <Container>
        <div className="mx-auto max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {needsVerification ? 'Verify your email' : 'Welcome Back, Rider'}
          </h1>
          <p className="mt-2 mb-7 text-sm text-gray-500 dark:text-gray-400">
            {needsVerification
              ? `We've sent a code to ${email.trim()} to finish setting up your account.`
              : "Your seat is waiting. Let's get you where you need to go."}
          </p>

          {needsVerification ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className={authLabelCls}>Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={authInputCls}
                  required
                />
              </div>
              {otpError && <p className="text-sm text-red-600 dark:text-red-400">{otpError}</p>}
              <button type="submit" className={authButtonCls} disabled={otpLoading}>
                {otpLoading ? 'Verifying…' : 'Verify and continue'}
              </button>
              <button
                type="button"
                onClick={() => authApi.sendSignupOtp(email.trim())}
                className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                Resend code
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={authLabelCls}>Email Address</label>
                <input
                  type="email"
                  placeholder="Johndoe@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={authInputCls}
                  required
                />
              </div>
              <div>
                <label className={authLabelCls}>Password</label>
                <PasswordInput
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <div className="pt-2">
                <button type="submit" className={authButtonCls} disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </div>
            </form>
          )}

          {!needsVerification && (
            <>
              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-app-500 hover:text-app-600">
                  Create Account
                </Link>
              </p>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Just here for one trip?{' '}
                <Link to="/book" className="font-semibold text-app-500 hover:text-app-600">
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
