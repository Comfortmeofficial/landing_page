import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/utils';
import { featuresLeft, featuresRight } from '@/data/features';
import type { Feature } from '@/types';

function FeatureItem({ feature, align }: { feature: Feature; align: 'left' | 'right' }) {
  const Icon = feature.icon;
  const isRight = align === 'right';

  return (
    <motion.div
      variants={fadeInUp}
      className={`flex flex-col ${isRight ? 'items-start text-left' : 'items-end text-right'} gap-3`}
    >
      <div className="inline-flex rounded-xl bg-white p-3">
        <Icon size={22} className="text-[#7CAE7A]" />
      </div>
      <div>
        <h3 className="font-bold text-white mb-1">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-white/70">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative bg-secondary-500 dark:bg-primary-600 pb-24 pt-10">
      {/* Wave transition from hero — light mode */}
      <div className="absolute top-0 left-0 right-0 dark:hidden" aria-hidden>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="h-20 w-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 Q360,80 720,40 Q1080,0 1440,80 L1440,0 L0,0 Z" fill="#F9FAFB" />
        </svg>
      </div>
      {/* Wave transition from hero — dark mode */}
      <div className="absolute top-0 left-0 right-0 hidden dark:block" aria-hidden>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="h-20 w-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 Q360,80 720,40 Q1080,0 1440,80 L1440,0 L0,0 Z" fill="#111827" />
        </svg>
      </div>
          {/* Decorative background shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-64 w-64 -skew-y-12 rounded-3xl bg-white/5" />
        <div className="absolute -right-16 bottom-1/3 h-48 w-48 skew-y-6 rounded-2xl bg-white/5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-24"
        >
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Your commute, the way it should be.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-white/75 leading-relaxed">
            ComfortMe is built around the details that matter because a truly comfortable ride
            starts long before you board the bus.
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-center">
          {/* Left features */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-12"
          >
            {featuresLeft.map((f) => (
              <FeatureItem key={f.id} feature={f} align="left" />
            ))}
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src="/iphone-x.png"
              alt="ComforMe app"
              className="w-64 lg:w-72 drop-shadow-2xl"
            />
          </motion.div>

          {/* Right features */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-12"
          >
            {featuresRight.map((f) => (
              <FeatureItem key={f.id} feature={f} align="right" />
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
