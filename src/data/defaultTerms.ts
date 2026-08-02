import type { PolicyContent } from '@/types';

export const defaultTerms: PolicyContent = {
  version: '2.41',
  updatedAt: 'June 26, 2025',
  sections: [
    {
      id: 'introduction',
      heading: 'Introduction',
      blocks: [
        {
          type: 'text',
          content:
            'Comfort Me (the "Company", "we", "us", or "our") provides an elite, curated platform connecting discerning individuals with bespoke lifestyle experiences and services. By accessing our platform, you agree to be bound by these Terms & Conditions.',
        },
        {
          type: 'text',
          content:
            'Our service philosophy is built on mutual respect and excellence. These terms are not just legal requirements but a blueprint for how we maintain the premium quality of the Comfort Me ecosystem.',
        },
        {
          type: 'blockquote',
          content:
            '"Our mission is to provide seamless comfort through transparency. If you find any part of these terms unclear, we encourage you to reach out to our dedicated legal liaison."',
        },
      ],
    },
    {
      id: 'obligations',
      heading: 'User Obligations',
      blocks: [
        {
          type: 'text',
          content:
            'As a member of the Comfort Me club, you commit to maintaining the integrity of our platform. This includes:',
        },
        {
          type: 'bullets',
          items: [
            { text: 'Providing accurate, up-to-date information for your personal profile and preferences.' },
            { text: 'Respecting the privacy and boundaries of our service partners and fellow members.' },
            { text: 'Maintaining the confidentiality of your unique access credentials.' },
          ],
        },
      ],
    },
    {
      id: 'payments',
      heading: 'Payments & Billing',
      blocks: [
        {
          type: 'text',
          content:
            'We offer tiered membership plans designed for different levels of engagement. All fees are transparent and communicated upfront before any transaction is finalized.',
        },
        {
          type: 'grid',
          items: [
            {
              title: 'Automated Billing',
              desc: 'Subscriptions are billed monthly or annually on the anniversary of your enrolment.',
            },
            {
              title: 'Currency & Taxes',
              desc: 'All prices are quoted in local currency inclusive of applicable VAT or luxury taxes.',
            },
          ],
        },
        {
          type: 'text',
          content:
            'Failure to maintain a valid payment method may result in a temporary suspension of access to concierge services.',
        },
      ],
    },
    {
      id: 'cancellation',
      heading: 'Cancellation Policy',
      blocks: [
        {
          type: 'text',
          content:
            'We believe in the freedom to choose. You may cancel your membership at any time through your dashboard or by notifying your personal manager.',
        },
        {
          type: 'plain-bullets',
          items: [
            'Cancellations take effect at the end of the current billing cycle.',
            'A "Grace Period" of 48 hours is granted for new annual subscriptions.',
            'Bespoke event bookings follow a separate 72-hour cancellation protocol.',
          ],
        },
      ],
    },
    {
      id: 'liability',
      heading: 'Limitation of Liability',
      blocks: [
        {
          type: 'text',
          content:
            'While we strive for perfection, Comfort Me acts as a facilitator for premium services. We meticulously vet every partner, but we are not liable for external delays or force majeure events.',
        },
        {
          type: 'text',
          content:
            'In no event shall Comfort Me be liable for any indirect, incidental, or consequential damages arising from your use of the platform, beyond the total amount paid by you in the preceding 12 months.',
        },
      ],
    },
  ],
};
