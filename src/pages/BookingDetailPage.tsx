import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { myBookingsApi } from '@/lib/api';
import { formatDateTime, STATUS_LABEL } from '@/components/booking/TicketCard';

function apiErrorMessage(err: unknown, fallback: string): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

const rowCls = 'flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0';
const labelCls = 'text-sm text-gray-500 dark:text-gray-400';
const valueCls = 'text-sm font-medium text-gray-900 dark:text-white text-right';

// Reached from a booking card in the account page's history — the
// reference in the URL is the same "unguessable, bearer-token-like
// credential" ticketApi/myBookingsApi.getByReference already treat as
// public, so this needs no login to actually load, only to have been
// linked to in the first place.
export function BookingDetailPage() {
  const { reference } = useParams<{ reference: string }>();

  const { data: booking, isLoading, isError, error } = useQuery({
    queryKey: ['booking', reference],
    queryFn: () => myBookingsApi.getByReference(reference!),
    enabled: !!reference,
  });

  const pickupStop = booking?.pickup_stop_id
    ? booking.ride.route.stops.find((s) => s.stop.id === booking.pickup_stop_id)?.stop.name
    : null;
  const dropoffStop = booking?.dropoff_stop_id
    ? booking.ride.route.stops.find((s) => s.stop.id === booking.dropoff_stop_id)?.stop.name
    : null;

  return (
    <main className="bg-white dark:bg-gray-900 pt-28 pb-24 min-h-screen">
      <Container>
        <div className="mx-auto max-w-lg">
          <Link
            to="/account"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
          >
            <ChevronLeft size={16} /> Back to account
          </Link>

          {isLoading && (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-secondary-500" />
            </div>
          )}

          {isError && (
            <p className="text-center text-sm text-red-500 py-10">
              {apiErrorMessage(error, "We couldn't find that booking.")}
            </p>
          )}

          {booking && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                  {booking.ride.route.location.name} &rarr; {booking.ride.route.destination.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDateTime(booking.ride.departure_time)}</p>
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

              <div className="flex justify-center mb-6">
                <div className="rounded-lg bg-white p-3">
                  <QRCodeSVG value={`CMBOOKING:${booking.id}:${booking.reference}`} size={140} />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-sm">
                <div className={rowCls}>
                  <span className={labelCls}>Booking Reference</span>
                  <span className={valueCls}>{booking.reference}</span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Seat</span>
                  <span className={valueCls}>{booking.seat_number}</span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Pickup Location</span>
                  <span className={valueCls}>{pickupStop ?? booking.ride.route.location.name}</span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Drop-off Location</span>
                  <span className={valueCls}>{dropoffStop ?? booking.ride.route.destination.name}</span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Driver & Bus</span>
                  <span className={valueCls}>
                    {booking.ride.driver_name} &middot; {booking.ride.bus_plate}
                  </span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Payment Method</span>
                  <span className={valueCls}>{booking.payment_method.replace('_', ' ')}</span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Fare</span>
                  <span className={valueCls}>{formatNaira(booking.amount)}</span>
                </div>
                {booking.discount_amount > 0 && (
                  <div className={rowCls}>
                    <span className={labelCls}>Discount {booking.coupon_code ? `(${booking.coupon_code})` : ''}</span>
                    <span className={valueCls}>-{formatNaira(booking.discount_amount)}</span>
                  </div>
                )}
                <div className={rowCls}>
                  <span className={labelCls}>Total Paid</span>
                  <span className={valueCls}>{formatNaira(booking.final_amount)}</span>
                </div>
                <div className={rowCls}>
                  <span className={labelCls}>Booked On</span>
                  <span className={valueCls}>{formatDateTime(booking.created_at)}</span>
                </div>
                {booking.rating != null && (
                  <div className={rowCls}>
                    <span className={labelCls}>Your Rating</span>
                    <span className={valueCls}>{booking.rating} / 5</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
