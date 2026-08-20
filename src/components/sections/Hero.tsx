import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { fadeInUp, staggerContainer } from '@/lib/utils';

const stats = [
  { value: '28+', label: 'Seater Buses' },
  { value: '0', label: 'Unannounced cancellations' },
  { value: '0', label: 'Late arrivals guaranteed' },
];

export function Hero() {
  return (
    <section className="relative bg-gray-50 dark:bg-gray-900 overflow-x-hidden pt-16">
      {/* Decorative blue blobs bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[480px] h-[480px] translate-x-1/4 translate-y-1/4"
      >
        <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-primary-100/70 dark:bg-primary-900/30" />
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-primary-100/50 dark:bg-primary-900/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[calc(90vh-4rem)] py-16 lg:py-24">
          {/* Left column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-2.5 text-base text-[#0B91F7] dark:text-[#0B91F7] mb-8 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0B91F7] flex-shrink-0 text-[#0B91F7]" />
                Launching in Lagos — Join the waitlist
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1] sm:text-5xl lg:text-6xl"
            >
              You are the <span className="text-[#0B91F7]">priority</span>.{' '}
              The ride proves it.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-gray-400"
            >
              Comfort, hospitality, and respect on every ride, without exception. ComfortMe takes care of every detail so all you have to do is show up.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button variant="primary" size="lg" className="bg-[#0B91F7] hover:bg-[#0A80E0] text-white">
                <a href="#contact">Join the Waitlist</a>
              </Button>
              <Button variant="outline" size="lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                {/* <PlayCircle size={20} /> */}
                 How It Works
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="mt-12 flex items-start gap-10"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-5xl font-black text-amber-500">{stat.value}</p>
                  <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column — bus image + booking card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full">
              <img
                src="/new_assets/top-illustration.png"
                alt="Comfortme passenger seated on a bus"
                className="w-full max-w-[760px] mx-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>

      
    </section>
  );
}
