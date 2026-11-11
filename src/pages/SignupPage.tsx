import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { PasswordInput } from '@/components/common/PasswordInput';
import { authApi } from '@/lib/api';
import { saveUserSession } from '@/lib/userSession';
import { authInputCls, authLabelCls, authButtonCls } from '@/lib/authStyles';
import type { SignupForm } from '@/types';

function apiErrorMessage(err: unknown, fallback: string): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
}

// Same split the mobile app's own set-password screen applies to its
// single "Full Name" field before calling signup — a one-word name
// becomes both first and last, same as there.
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') || parts[0] };
}

type Step = 'details' | 'otp';

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/account';

  const [step, setStep] = useState<Step>('details');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { firstName, lastName } = splitName(fullName);
      const form: SignupForm = { firstName, lastName, email, phone, password };
      await authApi.signup(form);
      // Account exists but is unverified until the OTP below is confirmed
      // — same order the mobile app's signup screen uses.
      await authApi.sendSignupOtp(email);
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
      const { firstName, lastName } = splitName(fullName);
      const tokens = await authApi.verifySignupOtp(email, otp.trim());
      saveUserSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        userId: tokens.user_id,
        firstName,
        lastName,
        email,
        phone,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not verify that code. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-white dark:bg-gray-900 pt-24 pb-24 min-h-screen">
      <Container>
        <div className="mx-auto max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
          <p className="mt-2 mb-7 text-sm text-gray-500 dark:text-gray-400">
            Your first comfortable ride is closer than you think.
          </p>

          {step === 'details' ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className={authLabelCls}>Full Name</label>
                <input
                  className={authInputCls}
                  placeholder="Input Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={authLabelCls}>Email Address</label>
                <input
                  type="email"
                  className={authInputCls}
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={authLabelCls}>Phone Number</label>
                <input
                  type="tel"
                  className={authInputCls}
                  placeholder="000-0000-000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={authLabelCls}>Password</label>
                <PasswordInput
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label className={authLabelCls}>Confirm Password</label>
                <PasswordInput
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <div className="pt-2">
                <button type="submit" className={authButtonCls} disabled={loading}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We've sent a 6-digit code to{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
              </p>
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
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <button type="submit" className={authButtonCls} disabled={loading}>
                {loading ? 'Verifying…' : 'Verify and continue'}
              </button>
              <button
                type="button"
                onClick={() => authApi.sendSignupOtp(email)}
                className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                Resend code
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-app-500 hover:text-app-600">
              Log in
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
