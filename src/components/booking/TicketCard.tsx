import { QRCodeSVG } from 'qrcode.react';
import type { Booking } from '@/types';

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

export function TicketCard({ booking }: { booking: Booking }) {
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
