import { useState } from 'react';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

const inputCls =
  'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 transition';

const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400';

const contactItems = [
  {
    Icon: Mail,
    title: 'Email Us',
    detail: 'info@comfortmeng.com',
  },
  // {
  //   Icon: MapPin,
  //   title: 'Visit Us',
  //   detail: '101 Silicon Valley Way, Palo Alto, CA 94301',
  // },
  {
    Icon: MessageSquare,
    title: 'Social Channels',
    detail: 'Sign up for early access and enjoy discounted fares when Comfort Me officially launches.',
  },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function set(field: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="bg-white dark:bg-gray-900 pt-28 pb-24">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            Whether you have a question about our services, safety protocols, or just want to say
            hello, we're here to help you find your comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="h-14 w-14 rounded-full bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center">
                  <Mail size={24} className="text-secondary-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message sent!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Message</label>
                  <textarea
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    rows={5}
                    className={`${inputCls} resize-none`}
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h2>

            <div className="flex flex-col gap-6">
              {contactItems.map(({ Icon, title, detail }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center">
                    <Icon size={18} className="text-secondary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{title}</p>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* HQ image */}
            <div className="relative overflow-hidden rounded-2xl mt-2">
              <img
                src="/9am-meeting.jpg"
                alt="Comfort Me Headquarters"
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-primary-900/60" />
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 mb-1">
                  {/* <div className="h-6 w-6 rounded bg-white/20 flex items-center justify-center">
                    <MapPin size={13} className="text-white" />
                  </div> */}
                  {/* <p className="text-sm font-bold text-white">Our Headquarters</p> */}
                </div>
                {/* <p className="text-xs text-white/75 ml-8">101 Silicon Valley Way, Palo Alto, CA 94301</p> */}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
