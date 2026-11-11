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

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // BookPage sends people here with `state: { from: '/book' }` when they
  // click "Log in" mid-checkout, so a login from there returns them to
  // finish booking instead of stranding them on this page.
  const from = (location.state as { from?: string } | null)?.from ?? '/account';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await authApi.login(email.trim(), password);
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
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not sign you in. Check your email and password.'));
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
              <LogIn size={24} className="text-secondary-500" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Log in to book without retyping your details every time.
            </p>
          </div>

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
        </div>
      </Container>
    </main>
  );
}
