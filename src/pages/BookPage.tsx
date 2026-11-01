import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeftRight, ChevronLeft, Loader2, MapPin, Plus, Search, ShieldCheck, Users, X } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { SeatGrid } from '@/components/booking/SeatGrid';
import { bookingApi, guestAuthApi, paymentApi, routesApi } from '@/lib/api';
import { getGuestSession, saveGuestSession } from '@/lib/guestSession';
import type { GuestCheckoutForm, PaymentMethod, Ride, RideSeat, Route } from '@/types';

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

interface BookingLeg {
  ride: Ride;
  seats: RideSeat[];
  pickupStopId: number | null;
  farePerSeat: number;
}

// Shared between the seats step's "Trips so far" cart and the pay step's
// final summary — onRemove is omitted on the pay step, where a leg can no
// longer be dropped.
function LegRow({ leg, onRemove }: { leg: BookingLeg; onRemove?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {leg.ride.route.location.name} &rarr; {leg.ride.route.destination.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatDateTime(leg.ride.departure_time)} &middot; Seat{leg.seats.length > 1 ? 's' : ''}:{' '}
          {leg.seats.map((s) => s.seat_number).join(', ')}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatNaira(leg.farePerSeat * leg.seats.length)}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove trip"
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
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
  const [routeQuery, setRouteQuery] = useState('');
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState<Ride[]>([]);

  // Ride + seats (the trip currently being picked)
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<RideSeat[]>([]);
  const [pickupStopId, setPickupStopId] = useState<number | null>(null);

  // Trips already committed to this purchase (a return trip, say) — a
  // guest checkout has no account to come back to later, so everything
  // being bought together needs to go through in one payment.
  const [legs, setLegs] = useState<BookingLeg[]>([]);

  // Guest identity
  const [guestForm, setGuestForm] = useState<GuestCheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [otp, setOtp] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('debit_card');

  const { data: routes = [], isLoading: routesLoading } = useQuery({
    queryKey: ['routes'],
    queryFn: routesApi.getRoutes,
  });

  const { data: seats = [], isLoading: seatsLoading } = useQuery({
    queryKey: ['seats', selectedRide?.id],
    queryFn: () => bookingApi.getSeats(selectedRide!.id),
    enabled: step === 'seats' && !!selectedRide,
  });

  const searchMutation = useMutation({
    mutationFn: (payload: { location: string; destination: string }) => bookingApi.search(payload),
    onSuccess: (rides) => {
      // Ride status never auto-advances after departure, so departed rides
      // must be filtered out client-side rather than trusting status alone
      // (same fix already applied in the mobile app's own search screen).
      setResults(rides.filter((r) => new Date(r.departure_time).getTime() > Date.now()));
      setStep('results');
    },
    onError: (err) => setError(apiErrorMessage(err, 'Could not search for trips. Please try again.')),
  });

  const selectRoute = (route: Route) => {
    setError(null);
    setLocation(route.location.name);
    setDestination(route.destination.name);
    searchMutation.mutate({ location: route.location.name, destination: route.destination.name });
  };

  // Routes have no explicit link to their reverse leg (createRoute on the
  // backend always creates the admin's requested route first, then
  // auto-generates the opposite-direction one right after as its own
  // independent row) — so pairing them up here just means finding, for each
  // route, another route whose location/destination are swapped, and
  // treating whichever of the two has the lower id as the "main" trip.
  const routeGroups = useMemo(() => {
    const consumed = new Set<number>();
    const groups: { main: Route; returnRoute: Route | null }[] = [];
    for (const route of routes) {
      if (consumed.has(route.id)) continue;
      // location_id and destination_id point at two separate tables
      // (locations/destinations) with independent id sequences — even the
      // same physical place has a different id in each, so pairing has to
      // match by name, the same way the backend's own findReturnRouteId
      // does, not by comparing ids directly (which can never line up).
      const reverse = routes.find(
        (r) =>
          !consumed.has(r.id) &&
          r.id !== route.id &&
          r.location.name.toLowerCase() === route.destination.name.toLowerCase() &&
          r.destination.name.toLowerCase() === route.location.name.toLowerCase(),
      );
      if (reverse) {
        const [main, returnRoute] = route.id < reverse.id ? [route, reverse] : [reverse, route];
        groups.push({ main, returnRoute });
        consumed.add(main.id);
        consumed.add(returnRoute.id);
      } else {
        groups.push({ main: route, returnRoute: null });
        consumed.add(route.id);
      }
    }
    groups.sort(
      (a, b) =>
        a.main.location.name.localeCompare(b.main.location.name) ||
        a.main.destination.name.localeCompare(b.main.destination.name),
    );
    return groups;
  }, [routes]);

  const matchesRouteQuery = (r: Route, q: string) =>
    r.location.name.toLowerCase().includes(q) ||
    r.destination.name.toLowerCase().includes(q) ||
    r.name.toLowerCase().includes(q);

  const filteredRouteGroups = useMemo(() => {
    const q = routeQuery.trim().toLowerCase();
    if (!q) return routeGroups;
    return routeGroups.filter(
      (g) => matchesRouteQuery(g.main, q) || (g.returnRoute && matchesRouteQuery(g.returnRoute, q)),
    );
  }, [routeGroups, routeQuery]);

  const selectedStop = selectedRide?.route.stops.find((s) => s.stop.id === pickupStopId) ?? null;
  const effectiveFare = selectedStop?.fare ?? selectedRide?.fare ?? 0;
  const currentLegFare = effectiveFare * Math.max(selectedSeats.length, 1);
  const legsTotalFare = legs.reduce((sum, l) => sum + l.farePerSeat * l.seats.length, 0);

  const toggleSeat = (seat: RideSeat) => {
    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id) ? prev.filter((s) => s.id !== seat.id) : [...prev, seat],
    );
  };

  // Commits the ride/seats/stop currently being picked as a leg of this
  // purchase — de-duped by ride id (picking the same ride again just
  // replaces the earlier entry), same as the mobile app's own cart.
  const commitCurrentLeg = (): BookingLeg[] => {
    if (!selectedRide || selectedSeats.length === 0) return legs;
    const leg: BookingLeg = { ride: selectedRide, seats: selectedSeats, pickupStopId, farePerSeat: effectiveFare };
    const next = [...legs.filter((l) => l.ride.id !== selectedRide.id), leg];
    setLegs(next);
    return next;
  };

  const removeLeg = (rideId: number) => setLegs((prev) => prev.filter((l) => l.ride.id !== rideId));

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
        legs: legs.map((l) => ({
          ride_id: l.ride.id,
          seat_numbers: l.seats.map((s) => s.seat_number),
          pickup_stop_id: l.pickupStopId,
        })),
        amount: legsTotalFare,
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
            <div className="space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={routeQuery}
                  onChange={(e) => setRouteQuery(e.target.value)}
                  placeholder="Search by city, e.g. Lagos or Abuja"
                  className={`${inputCls} pl-11`}
                  autoFocus
                />
              </div>

              {routesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-secondary-500" />
                </div>
              ) : filteredRouteGroups.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-12">
                  {routeQuery ? 'No routes match your search.' : 'No routes are available right now.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredRouteGroups.map((group) => (
                    <div
                      key={group.main.id}
                      className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
                    >
                      <button
                        disabled={searchMutation.isPending}
                        onClick={() => selectRoute(group.main)}
                        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors disabled:opacity-60"
                      >
                        <MapPin size={20} className="text-secondary-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {group.main.location.name} &rarr; {group.main.destination.name}
                          </p>
                          {/* <p className="text-xs text-gray-400 mt-0.5">{group.main.distance_km} km</p> */}
                        </div>
                        {searchMutation.isPending &&
                        location === group.main.location.name &&
                        destination === group.main.destination.name ? (
                          <Loader2 size={18} className="animate-spin text-secondary-500 shrink-0" />
                        ) : null}
                      </button>

                      {group.returnRoute && (
                        <button
                          disabled={searchMutation.isPending}
                          onClick={() => selectRoute(group.returnRoute!)}
                          className="w-full flex items-center gap-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 pl-8 pr-5 py-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors disabled:opacity-60"
                        >
                          <ArrowLeftRight size={16} className="text-secondary-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/30 px-1.5 py-0.5 rounded">
                              Return Trip
                            </span>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate mt-1">
                              {group.returnRoute.location.name} &rarr; {group.returnRoute.destination.name}
                            </p>
                            {/* <p className="text-xs text-gray-400 mt-0.5">{group.returnRoute.distance_km} km</p> */}
                          </div>
                          {searchMutation.isPending &&
                          location === group.returnRoute.location.name &&
                          destination === group.returnRoute.destination.name ? (
                            <Loader2 size={16} className="animate-spin text-secondary-500 shrink-0" />
                          ) : null}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              {legs.length > 0 && (
                <div className="space-y-2">
                  <label className={labelCls}>Trips so far</label>
                  {legs.map((leg) => (
                    <LegRow key={leg.ride.id} leg={leg} onRemove={() => removeLeg(leg.ride.id)} />
                  ))}
                </div>
              )}

              {selectedRide.route.stops.length > 0 && (
                <div>
                  <label className={labelCls}>Pickup Location</label>
                  <p className="mb-2 -mt-1 text-xs text-gray-500 dark:text-gray-400">
                    We've made pickup easy — choose the stop along the route closest to you.
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    <button
                      type="button"
                      onClick={() => setPickupStopId(null)}
                      className={`w-full flex items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left text-sm transition-colors ${
                        pickupStopId === null
                          ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        Default ({selectedRide.route.location.name})
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 shrink-0">
                        {formatNaira(selectedRide.fare)}
                      </span>
                    </button>
                    {selectedRide.route.stops.map((rs) => (
                      <button
                        key={rs.id}
                        type="button"
                        onClick={() => setPickupStopId(rs.stop.id)}
                        className={`w-full flex items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left text-sm transition-colors ${
                          pickupStopId === rs.stop.id
                            ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">{rs.stop.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 shrink-0">
                          {rs.fare != null ? formatNaira(rs.fare) : formatNaira(selectedRide.fare)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                  {formatNaira(currentLegFare)}
                </p>
              )}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={selectedSeats.length === 0}
                  onClick={() => {
                    commitCurrentLeg();
                    setStep('details');
                  }}
                >
                  Continue to Checkout
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  disabled={selectedSeats.length === 0}
                  onClick={() => {
                    commitCurrentLeg();
                    setSelectedRide(null);
                    setSelectedSeats([]);
                    setPickupStopId(null);
                    setStep('search');
                  }}
                >
                  <Plus size={16} /> Add Another Trip
                </Button>
                <p className="text-center text-xs text-gray-400">e.g. your return trip</p>
              </div>
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

          {step === 'pay' && legs.length > 0 && (
            <div className="space-y-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
              <div className="space-y-2 border-b border-gray-100 dark:border-gray-700 pb-5">
                <label className={labelCls}>
                  {legs.length > 1 ? `${legs.length} Trips` : 'Your Trip'}
                </label>
                {legs.map((leg) => (
                  <LegRow key={leg.ride.id} leg={leg} />
                ))}
              </div>

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
                <span className="text-xl font-bold text-gray-900 dark:text-white">{formatNaira(legsTotalFare)}</span>
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
                  `Pay ${formatNaira(legsTotalFare)}`
                )}
              </Button>
              <p className="text-center text-xs text-gray-400">
                You'll be redirected to our secure checkout partner to complete payment.
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
