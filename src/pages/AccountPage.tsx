import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, UserCircle2 } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { TicketCard } from '@/components/booking/TicketCard';
import { authApi, myBookingsApi } from '@/lib/api';
import { clearUserSession, getUserSession, type UserSession } from '@/lib/userSession';

export function AccountPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<UserSession | null>(null);

  // Read once on mount rather than at module scope — this page can be
  // reached by a direct URL visit from a browser tab with no session at
  // all, and useState's lazy initializer would run before the redirect
  // effect below gets a chance to fire.
  useEffect(() => {
    const s = getUserSession();
    if (!s) {
      navigate('/login', { replace: true, state: { from: '/account' } });
      return;
    }
    setSession(s);
  }, [navigate]);

  async function handleLogout() {
    if (session) {
      await authApi.logout(session.refreshToken).catch(() => {
        // Already logged out server-side, or the request failed — either
        // way the local session still needs clearing.
      });
    }
    clearUserSession();
    navigate('/', { replace: true });
  }

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['my-bookings', session?.userId],
    queryFn: () => myBookingsApi.list(session!.userId),
    enabled: !!session,
  });

  if (!session) return null;

  return (
    <main className="bg-white dark:bg-gray-900 pt-28 pb-24">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-50 dark:bg-secondary-900/20">
              <UserCircle2 size={24} className="text-secondary-500" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              My Account
            </h1>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-8 shadow-sm space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Name
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {session.firstName} {session.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">{session.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">{session.phone || '—'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg" fullWidth>
              <Link to="/book">Book a Trip</Link>
            </Button>
            <Button variant="outline" size="lg" fullWidth onClick={handleLogout}>
              Log out
            </Button>
          </div>

          <div className="mt-10">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Booking History</h2>
            {bookingsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-secondary-500" />
              </div>
            ) : bookings && bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <TicketCard key={b.id} booking={b} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                No bookings yet — once you book a trip, it'll show up here.
              </p>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
