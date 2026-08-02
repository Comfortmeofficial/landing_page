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

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
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
