import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader2, LogOut, Ticket } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { TicketCard } from '@/components/booking/TicketCard';
import { authApi, myBookingsApi } from '@/lib/api';
import { clearUserSession, getUserSession, type UserSession } from '@/lib/userSession';

// A single list row inside a section — icon, label, chevron — matching the
// mobile app's own Account screen menu items (customer_mobile_app's
// src/app/(app)/account/index.tsx) rather than this site's usual big
// bordered buttons.
function MenuRow({
  icon,
  label,
  to,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  const content = (
    <>
      <span className="flex items-center gap-3.5">
        <span className={danger ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}>{icon}</span>
        <span className={`text-sm font-medium ${danger ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
          {label}
        </span>
      </span>
      <ChevronRight size={18} className={danger ? 'text-red-300 dark:text-red-500' : 'text-gray-300 dark:text-gray-600'} />
    </>
  );
  const rowCls =
    'flex w-full items-center justify-between border-t border-gray-100 dark:border-gray-800 py-3.5 first:border-t-0';
  return to ? (
    <Link to={to} className={rowCls}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={rowCls}>
      {content}
    </button>
  );
}

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

  const PAGE_SIZE = 5;
  const [page, setPage] = useState(0);

  const { data: bookings, isLoading: bookingsLoading, isPlaceholderData } = useQuery({
    queryKey: ['my-bookings', session?.userId, page],
    queryFn: () => myBookingsApi.list(session!.userId, page * PAGE_SIZE, PAGE_SIZE),
    enabled: !!session,
    placeholderData: (previous) => previous,
  });

  // The backend doesn't return a total count, just a page of rows — a full
  // page back is the only signal there might be another one.
  const hasNextPage = (bookings?.length ?? 0) === PAGE_SIZE;

  if (!session) return null;

  return (
    <main className="bg-gray-50 dark:bg-gray-950 pt-20 pb-24 min-h-screen">
      <Container>
        <div className="mx-auto max-w-sm">
          {/* User card — avatar + name/email/phone, left-aligned, same
              shape as the app's own user card at the top of Account. */}
          <div className="flex items-center gap-3.5 rounded-[10px] bg-white dark:bg-gray-800 p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-app-500">
              <span className="text-2xl font-bold text-white">{session.firstName?.[0]?.toUpperCase() ?? 'U'}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[17px] font-bold text-gray-900 dark:text-white">
                {session.firstName} {session.lastName}
              </p>
              <p className="truncate text-[13px] text-gray-500 dark:text-gray-400">{session.email}</p>
              <p className="truncate text-[13px] text-gray-500 dark:text-gray-400">{session.phone || '—'}</p>
            </div>
          </div>

          <div className="mt-2 rounded-[10px] bg-white dark:bg-gray-800 px-4">
            <p className="pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              My Account
            </p>
            <MenuRow icon={<Ticket size={20} />} label="Book a Trip" to="/book" />
          </div>

          <div className="mt-2 rounded-[10px] bg-white dark:bg-gray-800 px-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-between py-3.5"
            >
              <span className="flex items-center gap-3.5">
                <LogOut size={20} className="text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">Log Out</span>
              </span>
              <ChevronRight size={18} className="text-red-300 dark:text-red-500" />
            </button>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Booking History
            </p>
            {bookingsLoading && !bookings ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-app-500" />
              </div>
            ) : bookings && bookings.length > 0 ? (
              <>
                <div className={`space-y-3 transition-opacity ${isPlaceholderData ? 'opacity-50' : ''}`}>
                  {bookings.map((b) => (
                    <TicketCard key={b.id} booking={b} linkTo={`/bookings/${b.reference}`} />
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-white"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span className="text-xs text-gray-400">Page {page + 1}</span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNextPage}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-white"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </>
            ) : (
              <p className="rounded-[10px] bg-white dark:bg-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No bookings yet — once you book a trip, it'll show up here.
              </p>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
