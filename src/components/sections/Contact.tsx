import { useState, type FormEvent } from 'react';
import { CheckCircle, ShieldCheck, Percent, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { fadeInUp, staggerContainer } from '@/lib/utils';
import { waitlistApi } from '@/lib/api';
import type { WaitlistFormData } from '@/types';

const INITIAL_FORM: WaitlistFormData = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  occupation: '',
  commuteDays: '',
  challenge: '',
  preference: '',
};

const inputCls =
  'w-full rounded-lg border-none bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/30 transition';

const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400';

export function Contact() {
  const [form, setForm] = useState<WaitlistFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof WaitlistFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Partial<Record<keyof WaitlistFormData, string>> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Valid email is required';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    if (!form.city.trim()) next.city = 'City is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError(null);
    try {
      await waitlistApi.join(form);
      setSubmitted(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setServerError(e.response?.data?.detail ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function set(field: keyof WaitlistFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-24">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
          {/* Left */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl leading-tight">
                <span className="text-secondary-500">Comfort </span>
                <span className="relative inline-block text-secondary-500">
                  Begins
                  <svg
                    viewBox="0 0 220 100"
                    className="pointer-events-none absolute -inset-x-3 -top-4 -bottom-2 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)]"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M110 10C60 4 20 20 16 46c-4 28 34 46 84 44 46-2 86-22 90-46 3-20-20-32-52-36"
                      stroke="#EC4899"
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Before You Board.</span>
              </h2>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              {[
                {
                  Icon: ShieldCheck,
                  title: 'Guaranteed Seating',
                  desc: 'Join the waitlist and secure your spot on the routes that matter most to you before anyone else.',
                },
                {
                  Icon: Percent,
                  title: 'A thank you for showing up early',
                  desc: "Be one of the first on ComfortMe and we'll make sure your first rides cost less. Early access, better fares.",
                },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-xl bg-amber-400 p-3">
                    <Icon size={20} className="text-emerald-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* App store section */}
            <motion.div variants={fadeInUp} className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                ComfortMe is coming to your phone.
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                The ComfortMe app is launching on iOS and Android very soon. Join the waitlist and we'll notify you the moment it's live.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {/* Google Play badge */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-gray-900 dark:bg-gray-800 px-4 py-2.5 text-white hover:bg-gray-700 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0" fill="currentColor">
                    <path d="M3.18 23.76A2 2 0 0 1 2 22V2A2 2 0 0 1 3.18.24L13.89 12 3.18 23.76zm17.3-10.32-2.8-1.6-3.14 3.14 3.14 3.14 2.82-1.62a2 2 0 0 0 0-3.06zM4.55 1.11l10.9 10.9-3.14 3.14L4.55 1.1z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <p className="text-[9px] font-light uppercase tracking-wider opacity-80">GET IT ON</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </a>
                {/* App Store badge */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-gray-900 dark:bg-gray-800 px-4 py-2.5 text-white hover:bg-gray-700 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <p className="text-[9px] font-light uppercase tracking-wider opacity-80">Download on the</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — form */}
          <motion.div
           id="contact"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <CheckCircle size={48} className="text-green-500" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    You're on the list!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                    We'll reach out as soon as Comfortme launches in your city.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={form.fullName}
                        onChange={(e) => set('fullName', e.target.value)}
                        className={inputCls}
                      />
                      {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        className={inputCls}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Phone</label>
                      <input
                        type="tel"
                        placeholder="+234 000 000 0000"
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        className={inputCls}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>City</label>
                      <input
                        type="text"
                        placeholder="Lagos, Nigeria"
                        value={form.city}
                        onChange={(e) => set('city', e.target.value)}
                        className={inputCls}
                      />
                      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                    </div>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className={labelCls}>Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={form.occupation}
                      onChange={(e) => set('occupation', e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  {/* Survey */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      A quick survey to help us serve you better:
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-xs text-gray-500 dark:text-gray-400">
                          How many days a week do you commute?
                        </label>
                        <select
                          value={form.commuteDays}
                          onChange={(e) => set('commuteDays', e.target.value)}
                          className={inputCls}
                        >
                          <option value="">1-2 days</option>
                          <option>1–2 days</option>
                          <option>3–4 days</option>
                          <option>5 days</option>
                          <option>More than 5 days</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs text-gray-500 dark:text-gray-400">
                          What's your biggest challenge with current commuting?
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Unreliability, comfort, cost"
                          value={form.challenge}
                          onChange={(e) => set('challenge', e.target.value)}
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs text-gray-500 dark:text-gray-400">
                          Would you prefer a subscription or pay-per-ride?
                        </label>
                        <div className="flex items-center gap-6">
                          {(['subscription', 'pay-per-ride'] as const).map((val) => (
                            <label key={val} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="preference"
                                value={val}
                                checked={form.preference === val}
                                onChange={() => set('preference', val)}
                                className="accent-secondary-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {val === 'pay-per-ride' ? 'Pay-per-ride' : 'Subscription'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {serverError && (
                    <p className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                      {serverError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="mt-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      'Reserve My Spot'
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
