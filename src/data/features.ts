import {
  CalendarDays,
  Users,
  CreditCard,
  Bus,
  Ticket,
  Tag,
} from 'lucide-react';
import type { Feature } from '@/types';

export const featuresLeft: Feature[] = [
  {
    id: 'schedule',
    icon: CalendarDays,
    title: 'Schedule Rides in Advance',
    description:
      'Plan your trips ahead of time and secure your seat before the day begins, giving you a stress-free commuting experience.',
  },
  {
    id: 'multi-seat',
    icon: Users,
    title: 'Reserve Multiple Seats',
    description:
      'Easily reserve multiple seats for friends, family members, colleagues, or group trips without making separate bookings.',
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: 'Smart Wallet Payments',
    description:
      'Top up your wallet once and enjoy seamless, cashless payments for every ride without the hassle of carrying cash.',
  },
];

export const featuresRight: Feature[] = [
  {
    id: 'rental',
    icon: Tag,
    title: 'Weekend Bus Rentals',
    description:
      'Easily request a bus rental for weekends directly through the platform.',
  },
  {
    id: 'discounts',
    icon: Ticket,
    title: 'Discounts & Promo Coupons',
    description:
      'Apply coupons and special offers to reduce ride costs and get even more value from your daily transportation.',
  },
  {
    id: 'coasters',
    icon: Bus,
    title: 'Comfortable & Reliable Buses',
    description:
      'Ride in modern 28+-seater coaster buses operated by verified drivers, ensuring a safe, comfortable, and dependable journey.',
  },
];

export const features: Feature[] = [...featuresLeft, ...featuresRight];
