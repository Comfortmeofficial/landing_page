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
    title: 'Your seat, secured.',
    description:
      "Plan your trips ahead and never worry about whether there's space for you. Your seat is waiting before the day even begins.",
  },
  {
    id: 'multi-seat',
    icon: Users,
    title: 'Bringing someone along?',
    description:
      'Reserve multiple seats in one booking. No separate trips, no extra hassle.',
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: 'Pay once, ride seamlessly.',
    description:
      'Top up your wallet and every ride is taken care of. No cash, no stress, no friction.',
  },
];

export const featuresRight: Feature[] = [
  {
    id: 'rental',
    icon: Tag,
    title: 'Taking the whole crew?',
    description:
      "From corporate outings to friends' trip, book a rental and leave the logistics to us.",
  },
  {
    id: 'discounts',
    icon: Ticket,
    title: 'Ride more, spend less.',
    description:
      'Apply promo codes and special offers to make every ride even better value.',
  },
  {
    id: 'coasters',
    icon: Bus,
    title: 'Buses built for comfort.',
    description:
      'Every ComfortMe bus is modern, air-conditioned, and operated by a professionally trained driver, because the vehicle is part of the experience.',
  },
];

export const features: Feature[] = [...featuresLeft, ...featuresRight];
