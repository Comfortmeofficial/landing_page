import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { accountDeletionApi } from '@/lib/api';

const inputCls =
  'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition';

const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400';

function apiErrorMessage(err: unknown, fallback: string): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
}

type Step = 'email' | 'otp' | 'done';

export function DeleteAccountPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await accountDeletionApi.requestCode(email.trim());
      setStep('otp');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not send a code. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await accountDeletionApi.confirm(email.trim(), otp.trim());
      setStep('done');
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
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
              <ShieldAlert size={24} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Delete Your Account
            </h1>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              This permanently deletes your Comfortme account and cannot be undone. You don't need
              the app installed to do this — we'll verify it's really you with a code sent to your
              email first.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
            {step === 'done' ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <div className="h-14 w-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account deleted</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  Your Comfortme account and its data have been deleted. If you change your mind,
                  you're welcome to sign up again any time.
                </p>
              </div>
            ) : step === 'email' ? (
              <form onSubmit={handleRequestCode} className="space-y-5">
                <div className="flex items-start gap-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4">
                  <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    Deleting your account removes your profile, saved cards, referral code, and
                    booking history from Comfortme. Trips already completed or in progress are not
                    affected, and this can't be reversed.
                  </p>
                </div>
                <div>
                  <label className={labelCls}>Account Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Sending code…' : 'Send verification code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleConfirm} className="space-y-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We've sent a 6-digit code to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
                  Enter it below to permanently delete your account.
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
                  {loading ? 'Deleting…' : 'Permanently delete my account'}
                </Button>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setOtp(''); setError(null); }}
                  className="w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Use a different email or resend the code
                </button>
              </form>
            )}
          </div>

          {step !== 'done' && (
            <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
              Changed your mind? Just close this page — nothing happens until you enter a code.
            </p>
          )}
        </div>
      </Container>
    </main>
  );
}
