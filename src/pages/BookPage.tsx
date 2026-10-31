import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2, MapPin, ShieldCheck, Users } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { SeatGrid } from '@/components/booking/SeatGrid';
import { bookingApi, guestAuthApi, paymentApi, routesApi } from '@/lib/api';
import { getGuestSession, saveGuestSession } from '@/lib/guestSession';
import type { GuestCheckoutForm, PaymentMethod, Ride, RideSeat } from '@/types';

const inputCls =
  'w-full rounded-lg border-none bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/30 transition';

const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400';

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

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

type Step = 'search' | 'results' | 'seats' | 'details' | 'otp' | 'pay';

const STEP_ORDER: Step[] = ['search', 'results', 'seats', 'details', 'pay'];

function StepHeader({ step, onBack }: { step: Step; onBack?: () => void }) {
  const titles: Record<Step, string> = {
    search: 'Book a trip',
    results: 'Choose a ride',
    seats: 'Choose your seat',
    details: 'Your details',
    otp: 'Verify it’s you',
    pay: 'Pay for your trip',
  };
  const visibleIndex = STEP_ORDER.indexOf(step === 'otp' ? 'details' : step);
  return (
    <div className="mb-8">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        >
          <ChevronLeft size={16} /> Back
        </button>
      )}
      <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        {titles[step]}
      </h1>
      {visibleIndex >= 0 && (
        <div className="mt-4 flex gap-1.5">
          {STEP_ORDER.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${i <= visibleIndex ? 'bg-secondary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function BookPage() {
  const [step, setStep] = useState<Step>('search');
  const [error, setError] = useState<string | null>(null);

  // Search
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState<Ride[]>([]);

  // Ride + seats
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<RideSeat[]>([]);
  const [pickupStopId, setPickupStopId] = useState<number | null>(null);

  // Guest identity
  const [guestForm, setGuestForm] = useState<GuestCheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [otp, setOtp] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('debit_card');

  const { data: locations = [] } = useQuery({ queryKey: ['locations'], queryFn: routesApi.getLocations });
  const { data: destinations = [] } = useQuery({ queryKey: ['destinations'], queryFn: routesApi.getDestinations });

  const { data: seats = [], isLoading: seatsLoading } = useQuery({
    queryKey: ['seats', selectedRide?.id],
    queryFn: () => bookingApi.getSeats(selectedRide!.id),
    enabled: step === 'seats' && !!selectedRide,
  });

  const searchMutation = useMutation({
    mutationFn: () => bookingApi.search({ location: location || undefined, destination }),
    onSuccess: (rides) => {
      setResults(rides);
      setStep('results');
    },
    onError: (err) => setError(apiErrorMessage(err, 'Could not search for trips. Please try again.')),
  });

  const selectedStop = selectedRide?.route.stops.find((s) => s.stop.id === pickupStopId) ?? null;
  const effectiveFare = selectedStop?.fare ?? selectedRide?.fare ?? 0;
  const totalFare = effectiveFare * Math.max(selectedSeats.length, 1);

  const toggleSeat = (seat: RideSeat) => {
    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id) ? prev.filter((s) => s.id !== seat.id) : [...prev, seat],
    );
  };

  const requestOtpMutation = useMutation({
    mutationFn: () => guestAuthApi.requestCode(guestForm.email),
    onSuccess: () => setStep('otp'),
    onError: (err) => setError(apiErrorMessage(err, 'Could not send a verification code. Please try again.')),
  });

  const startSessionMutation = useMutation({
    mutationFn: () => guestAuthApi.start(guestForm),
    onSuccess: (result) => {
      setError(null);
      if (result.requires_verification) {
        requestOtpMutation.mutate();
        return;
      }
      saveGuestSession({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        userId: result.user_id,
        email: guestForm.email,
      });
      setStep('pay');
    },
    onError: (err) => setError(apiErrorMessage(err, 'Something went wrong. Please try again.')),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () => guestAuthApi.verify(guestForm.email, otp),
    onSuccess: (result) => {
      if (result.requires_verification) return; // shouldn't happen, but keep TS happy
      setError(null);
      saveGuestSession({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        userId: result.user_id,
        email: guestForm.email,
      });
      setStep('pay');
    },
    onError: (err) => setError(apiErrorMessage(err, 'That code is invalid or has expired.')),
  });

  const payMutation = useMutation({
    mutationFn: () => {
      const session = getGuestSession();
      if (!session) throw new Error('Session expired');
      return paymentApi.payBooking({
        user_id: session.userId,
        email: guestForm.email,
        ride_id: selectedRide!.id,
        seat_numbers: selectedSeats.map((s) => s.seat_number),
        pickup_stop_id: pickupStopId,
        amount: totalFare,
        payment_method: paymentMethod,
        callback_url: `${window.location.origin}/book/confirm`,
      });
    },
    onSuccess: (result) => {
      if (result.authorization_url) {
        window.location.href = result.authorization_url;
        return;
      }
      setError('Payment could not be started. Please try again.');
    },
    onError: (err) => setError(apiErrorMessage(err, 'Payment could not be started. Please try again.')),
  });

  const destinationOptions = useMemo(
    () => destinations.filter((d) => !location || d.name !== location),
    [destinations, location],
  );

  return (
    <main className="bg-white dark:bg-gray-900 pt-28 pb-24 min-h-screen">
      <Container>
        <div className="mx-auto max-w-2xl">
          <StepHeader
            step={step}
            onBack={
              step === 'results'
                ? () => setStep('search')
                : step === 'seats'
                  ? () => setStep('results')
                  : step === 'details'
                    ? () => setStep('seats')
                    : step === 'otp'
                      ? () => setStep('details')
                      : step === 'pay'
                        ? () => setStep('details')
                        : undefined
            }
          />

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {step === 'search' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                searchMutation.mutate();
              }}
              className="space-y-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm"
            >
              <div>
                <label className={labelCls}>From (optional)</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls}>
                  <option value="">Any pickup location</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>To</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className={inputCls}
                  required
                >
                  <option value="" disabled>
                    Select a destination
                  </option>
                  {destinationOptions.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={searchMutation.isPending || !destination}>
                {searchMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Searching…
                  </>
                ) : (
                  'Find Trips'
                )}
              </Button>
            </form>
          )}

          {step === 'results' && (
            <div className="space-y-3">
              {results.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-12">
                  No trips found for that route right now.
                </p>
              ) : (
                results.map((ride) => (
                  <button
                    key={ride.id}
                    onClick={() => {
                      setSelectedRide(ride);
                      setSelectedSeats([]);
                      setPickupStopId(null);
                      setStep('seats');
                    }}
                    className="w-full flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 text-left shadow-sm hover:border-secondary-300 transition-colors"
                  >
                    <MapPin size={20} className="text-secondary-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {ride.route.location.name} &rarr; {ride.route.destination.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(ride.departure_time)}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Users size={12} /> {ride.total_seats - ride.booked_seats} seats left
                      </p>
                    </div>
                    <p className="font-bold text-secondary-500 whitespace-nowrap">{formatNaira(ride.fare)}</p>
                  </button>
                ))
              )}
            </div>
          )}

          {step === 'seats' && selectedRide && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                {seatsLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-secondary-500" />
                  </div>
                ) : (
                  <SeatGrid
                    seats={seats}
                    selected={selectedSeats}
                    onToggle={toggleSeat}
                    driverRow={selectedRide.driver_row}
                    driverCol={selectedRide.driver_col}
                  />
                )}
              </div>
              {selectedSeats.length > 0 && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  Seat{selectedSeats.length > 1 ? 's' : ''}:{' '}
                  <strong>{selectedSeats.map((s) => s.seat_number).join(', ')}</strong> &middot;{' '}
                  {formatNaira(selectedRide.fare * selectedSeats.length)}
                </p>
              )}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={selectedSeats.length === 0}
                onClick={() => setStep('details')}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 'details' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                startSessionMutation.mutate();
              }}
              className="space-y-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No account needed — just enough to send your ticket to.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input
                    className={inputCls}
                    value={guestForm.firstName}
                    onChange={(e) => setGuestForm((f) => ({ ...f, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input
                    className={inputCls}
                    value={guestForm.lastName}
                    onChange={(e) => setGuestForm((f) => ({ ...f, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  className={inputCls}
                  value={guestForm.email}
                  onChange={(e) => setGuestForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
                <p className="mt-1 text-xs text-gray-400">Your ticket and receipt go here.</p>
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  type="tel"
                  className={inputCls}
                  placeholder="+234 000 000 0000"
                  value={guestForm.phone}
                  onChange={(e) => setGuestForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={startSessionMutation.isPending}>
                {startSessionMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Continuing…
                  </>
                ) : (
                  'Continue to payment'
                )}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                verifyOtpMutation.mutate();
              }}
              className="space-y-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm"
            >
              <div className="flex items-start gap-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
                <ShieldCheck size={18} className="text-secondary-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  An account already exists with <strong>{guestForm.email}</strong>. We've sent a code to confirm
                  it's you — enter it below to continue checking out.
                </p>
              </div>
              <div>
                <label className={labelCls}>Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  className={inputCls}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={verifyOtpMutation.isPending}>
                {verifyOtpMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Verifying…
                  </>
                ) : (
                  'Verify and continue'
                )}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  requestOtpMutation.mutate();
                }}
                className="w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                Resend code
              </button>
            </form>
          )}

          {step === 'pay' && selectedRide && (
            <div className="space-y-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
              <div className="space-y-1 border-b border-gray-100 dark:border-gray-700 pb-4">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedRide.route.location.name} &rarr; {selectedRide.route.destination.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(selectedRide.departure_time)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Seat{selectedSeats.length > 1 ? 's' : ''}: {selectedSeats.map((s) => s.seat_number).join(', ')}
                </p>
              </div>

              {selectedRide.route.stops.length > 0 && (
                <div>
                  <label className={labelCls}>Pickup Location</label>
                  <select
                    className={inputCls}
                    value={pickupStopId ?? ''}
                    onChange={(e) => setPickupStopId(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">Default ({selectedRide.route.location.name})</option>
                    {selectedRide.route.stops.map((rs) => (
                      <option key={rs.id} value={rs.stop.id}>
                        {rs.stop.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className={labelCls}>Payment Method</label>
                <div className="flex gap-3">
                  {(['debit_card', 'bank_transfer'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                        paymentMethod === m
                          ? 'border-secondary-500 bg-secondary-50 text-secondary-600 dark:bg-secondary-900/20'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {m === 'debit_card' ? 'Debit / Credit Card' : 'Bank Transfer'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{formatNaira(totalFare)}</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={payMutation.isPending}
                onClick={() => {
                  setError(null);
                  payMutation.mutate();
                }}
              >
                {payMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Starting payment…
                  </>
                ) : (
                  `Pay ${formatNaira(totalFare)}`
                )}
              </Button>
              <p className="text-center text-xs text-gray-400">
                You'll be taken to Paystack's secure checkout to complete payment.
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
