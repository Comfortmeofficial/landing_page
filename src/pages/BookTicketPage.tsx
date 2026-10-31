import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, Search, Ticket } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { ticketApi } from '@/lib/api';
import type { Booking } from '@/types';

const inputCls =
  'w-full rounded-lg border-none bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/30 transition';

function apiErrorMessage(err: unknown, fallback: string): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_LABEL: Record<Booking['status'], string> = {
  pending: 'Pending',
  confirmed: 'Upcoming',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// The exact same "CMBOOKING:{booking_id}:{reference}" string the
// confirmation email's QR and the mobile app's own ticket screen encode —
// checkBoardingCode() only ever checks the reference half, so this scans
// identically no matter which of the three it came from.
function ticketPayload(booking: Booking) {
  return `CMBOOKING:${booking.id}:${booking.reference}`;
}

function TicketCard({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
      <div className="shrink-0 rounded-lg bg-white p-3">
        <QRCodeSVG value={ticketPayload(booking)} size={120} />
      </div>
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <p className="font-semibold text-gray-900 dark:text-white">
          {booking.ride.route.location.name} &rarr; {booking.ride.route.destination.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDateTime(booking.ride.departure_time)}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Seat {booking.seat_number}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{booking.ride.bus_plate}</p>
        <span
          className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            booking.status === 'cancelled'
              ? 'bg-red-50 text-red-600 dark:bg-red-900/20'
              : 'bg-secondary-50 text-secondary-600 dark:bg-secondary-900/20'
          }`}
        >
          {STATUS_LABEL[booking.status]}
        </span>
      </div>
    </div>
  );
}

// Looks up a purchase later by its reference — the one printed in the
// confirmation email ("Booking Reference: ...") — no login needed, since
// the reference itself is an unguessable UUID that only the buyer has.
export function BookTicketPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialReference = searchParams.get('reference') ?? '';
  const [input, setInput] = useState(initialReference);

  const reference = searchParams.get('reference');
  const { data: bookings, isLoading, isError, error } = useQuery({
    queryKey: ['ticket', reference],
    queryFn: () => ticketApi.getByReference(reference!),
    enabled: !!reference,
  });

  return (
    <main className="bg-white dark:bg-gray-900 pt-28 pb-24 min-h-screen">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-50 dark:bg-secondary-900/20">
              <Ticket size={24} className="text-secondary-500" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Find your ticket
            </h1>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Enter the booking reference from your confirmation email.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) setSearchParams({ reference: input.trim() });
            }}
            className="flex gap-3 mb-8"
          >
            <input
              className={inputCls}
              placeholder="e.g. 7c4f0a2e-1b3d-4e5f-8a90-..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" variant="primary" size="md" disabled={!input.trim()}>
              <Search size={16} />
            </Button>
          </form>

          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-secondary-500" />
            </div>
          )}

          {isError && (
            <p className="text-center text-sm text-red-500 py-6">
              {apiErrorMessage(error, "We couldn't find a booking with that reference.")}
            </p>
          )}

          {bookings && (
            <div className="space-y-4">
              {bookings.map((b) => (
                <TicketCard key={b.id} booking={b} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
