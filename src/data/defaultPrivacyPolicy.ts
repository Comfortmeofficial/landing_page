import type { PolicyContent } from '@/types';

export const defaultPrivacyPolicy: PolicyContent = {
  version: '2.41',
  updatedAt: 'June 26, 2025',
  sections: [
    {
      id: 'commitment',
      heading: 'Commitment to Privacy',
      blocks: [
        {
          type: 'text',
          content:
            'Our relationship with our members is built on trust. We believe you should always know what data we collect from you and how we use it, and that you should have meaningful control over both.',
        },
        {
          type: 'text',
          content:
            'This policy describes the types of information we may collect from you or that you may provide when you visit the Comfortme platform and our practices for collecting, using, maintaining, protecting, and disclosing that information.',
        },
        {
          type: 'blockquote',
          content:
            '"Transparency is the cornerstone of premium service. We handle your personal data with the utmost discretion and security."',
        },
      ],
    },
    {
      id: 'data-collection',
      heading: 'Information Collection',
      blocks: [
        {
          type: 'text',
          content:
            'To provide our bespoke lifestyle experiences, we collect information that identifies, relates to, or describes you:',
        },
        {
          type: 'bullets',
          items: [
            {
              label: 'Personal Identifiers',
              text: 'Name, email address, phone number, and physical address for concierge deliveries.',
            },
            {
              label: 'Preference Data',
              text: 'Lifestyle preferences, dietary requirements, and curated interests to personalize your experience.',
            },
            {
              label: 'Usage Information',
              text: 'Details of your interactions with our platform, including search queries and service history.',
            },
          ],
        },
      ],
    },
    {
      id: 'data-usage',
      heading: 'Data Usage',
      blocks: [
        {
          type: 'text',
          content:
            'We use the information we collect to maintain the excellence of the Comfortme ecosystem and to deliver the seamless service you expect.',
        },
        {
          type: 'grid',
          items: [
            {
              title: 'Service Personalization',
              desc: 'We tailor our recommendations and experiences based on your unique profile and past interactions.',
            },
            {
              title: 'Platform Security',
              desc: 'Your data helps us detect and prevent fraudulent activities and ensure the safety of all members.',
            },
          ],
        },
        {
          type: 'text',
          content:
            'Your information allows us to communicate effectively regarding your membership, updates to our services, and exclusive opportunities.',
        },
      ],
    },
    {
      id: 'third-party',
      heading: 'Third-Party Sharing',
      blocks: [
        {
          type: 'text',
          content:
            'We do not sell your personal data. We only share information with trusted partners necessary to fulfil your service requests:',
        },
        {
          type: 'bullets',
          items: [
            {
              label: 'Vetted Partners',
              text: 'Service providers who assist in delivering your requested experiences (e.g., luxury transport, private chefs).',
            },
            {
              label: 'Professional Advisors',
              text: 'Legal, insurance, and financial auditors who help us maintain compliance and quality.',
            },
            {
              label: 'Legal Compliance',
              text: 'When required by law to protect our rights or the safety of our members.',
            },
          ],
        },
      ],
    },
    {
      id: 'your-rights',
      heading: 'Your Rights',
      blocks: [
        {
          type: 'text',
          content:
            'We provide you with tools to manage your data privacy. You have the right to access, correct, or request the deletion of your personal information at any time.',
        },
        {
          type: 'text',
          content:
            'Depending on your jurisdiction, you may have additional rights regarding data portability and the restriction of processing. Our dedicated privacy team is here to help you exercise these rights seamlessly.',
        },
      ],
    },
  ],
};
