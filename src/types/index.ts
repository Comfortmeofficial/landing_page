import { type LucideIcon } from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
  side: 'left' | 'right';
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
  text: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface WaitlistFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  occupation: string;
  commuteDays: string;
  challenge: string;
  preference: 'subscription' | 'pay-per-ride' | '';
}

export type PolicyBlock =
  | { type: 'text'; content: string }
  | { type: 'blockquote'; content: string }
  | { type: 'bullets'; items: { label?: string; text: string }[] }
  | { type: 'plain-bullets'; items: string[] }
  | { type: 'grid'; items: { title: string; desc: string }[] };

export interface PolicySection {
  id: string;
  heading: string;
  blocks: PolicyBlock[];
}

export interface PolicyContent {
  version: string;
  updatedAt: string;
  sections: PolicySection[];
}

// ─── Guest ticket purchase ──────────────────────────────────────────────

export interface Location {
  id: number;
  name: string;
  state: string;
}

export interface Destination {
  id: number;
  name: string;
  state: string;
}

export interface Stop {
  id: number;
  name: string;
  state: string;
}

export interface RouteStop {
  id: number;
  stop_order: number;
  fare: number | null;
  stop: Stop;
  // Ride-specific: whether the marshal has ticked this stop off as already
  // passed, so it stops being offered as a pickup choice.
  passed?: boolean;
}

export interface Route {
  id: number;
  name: string;
  location: Location;
  destination: Destination;
  stops: RouteStop[];
  distance_km: number;
}

export interface Ride {
  id: number;
  route_id: number;
  driver_name: string;
  bus_plate: string;
  bus_model: string;
  departure_time: string;
  fare: number;
  total_seats: number;
  booked_seats: number;
  status: 'scheduled' | 'boarding' | 'active' | 'completed' | 'cancelled';
  route: Route;
  driver_row?: number | null;
  driver_col?: number | null;
  // Whether the route's own starting point ("Default" pickup) has been
  // ticked off as passed by the marshal on this ride.
  origin_passed?: boolean;
}

export interface RideSeat {
  id: number;
  ride_id: number;
  seat_number: string;
  row: number;
  col: number;
  seat_type: 'standard' | 'premium' | 'disabled';
  status: 'available' | 'booked';
}

export interface GuestCheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type GuestSessionResponse =
  | { requires_verification: true }
  | { requires_verification: false; access_token: string; refresh_token: string; user_id: number };

export interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginTokens {
  access_token: string;
  refresh_token: string;
  user_id: number;
}

// Trimmed to the fields the website actually uses — the backend's UserDto
// carries several more (emergency contact, push token, …) that only the
// mobile app's own account screens touch.
export interface UserProfileDto {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
}

export type PaymentMethod = 'debit_card' | 'bank_transfer';

export interface PayBookingLeg {
  ride_id: number;
  seat_numbers: string[];
  pickup_stop_id?: number | null;
  dropoff_stop_id?: number | null;
}

export interface PayBookingResult {
  success: boolean;
  message: string;
  reference: string;
  amount?: number;
  discount?: number;
  authorization_url?: string;
  booking_id?: number;
}

export interface PaystackVerifyResult {
  reference: string;
  amount: number;
  status: string;
  booking_id?: number;
}

export interface Booking {
  id: number;
  reference: string;
  group_reference: string;
  seat_number: string;
  final_amount: number;
  payment_method: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  is_on_board: boolean;
  ride: Ride;
  created_at: string;
}
