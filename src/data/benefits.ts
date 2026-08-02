import type { BenefitItem } from '@/types';
import {
  CalendarCheck,
  Users,
  Wallet,
  BadgePercent,
  Gift,
  Bus,
} from 'lucide-react';

export const benefits: BenefitItem[] = [
  {
    icon: CalendarCheck,
    title: 'Schedule Rides in Advance',
    description:
      'Plan your trips ahead of time and secure your seat before the day begins, giving you a stress-free commuting experience.',
    side: 'left',
  },
  {
    icon: Users,
    title: 'Reserve Multiple Seats',
    description:
      'Easily reserve multiple seats for friends, family members, colleagues, or group trips without making separate bookings.',
    side: 'left',
  },
  {
    icon: Wallet,
    title: 'Smart Wallet Payments',
    description:
      'Top up your wallet once and enjoy seamless, cashless payments for every ride without the hassle of carrying cash.',
    side: 'left',
  },
  {
    icon: BadgePercent,
    title: 'Subscription-Based Savings',
    description:
      'Unlock discounted fares, exclusive perks, and a more affordable commuting experience through flexible subscription plans.',
    side: 'right',
  },
  {
    icon: Gift,
    title: 'Discounts & Promo Coupons',
    description:
      'Apply coupons and special offers to reduce ride costs and get even more value from your daily transportation.',
    side: 'right',
  },
  {
    icon: Bus,
    title: 'Comfortable & Reliable Buses',
    description:
      'Ride in modern 29-seater coaster buses operated by verified drivers, ensuring a safe, comfortable, and dependable journey.',
    side: 'right',
  },
];
