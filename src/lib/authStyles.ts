// Shared look for the account/login/signup pages, matched to the mobile
// app's own Input/Button components (src/components/ui/Input.tsx,
// Button.tsx in customer_mobile_app): 52px-tall fields, 10px corners,
// a plain gray-200 border, and a normal-case label sitting directly above
// the field — not the uppercase/tracked labels the rest of this marketing
// site's forms use. Kept separate from that site-wide style on purpose:
// these are the pages people now expect to feel like "their account",
// consistent with the app, not like the marketing pages around them.
export const authInputCls =
  'w-full rounded-[10px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 h-[52px] text-[15px] text-gray-900 dark:text-white placeholder-gray-400 focus:border-app-500 focus:outline-none focus:ring-2 focus:ring-app-500/20 transition';

export const authLabelCls = 'mb-1.5 block text-sm font-medium text-gray-900 dark:text-gray-100';

export const authButtonCls =
  'flex h-[52px] w-full items-center justify-center rounded-[10px] bg-app-500 text-base font-semibold text-white transition-colors hover:bg-app-600 disabled:opacity-50 disabled:pointer-events-none';
