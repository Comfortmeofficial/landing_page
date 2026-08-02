import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { fadeInUp, staggerContainer } from '@/lib/utils';

const stats = [
  { value: '28+', label: 'Seater Buses' },
  { value: '24/7', label: 'Fleet dispatch' },
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
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 mb-8 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-secondary-500 flex-shrink-0" />
                Launching in Lagos — Join the waitlist
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeInUp}
              className="text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1] lg:text-4xl"
            >
              You are the priority.{' '}
              <span className="text-secondary-500">The ride proves it.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-lg text-base leading-relaxed text-gray-500 dark:text-gray-400"
            >
              Your bus ride, planned your way. Schedule ahead, reserve your seat, and enjoy the journey from the moment you book.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button variant="primary" size="lg">
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
                  <p className="text-3xl font-black text-secondary-500">{stat.value}</p>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
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
            <div className="relative w-full  ">
              <img
                src="/bus-img.png"
                alt="Comfort Me Bus"
                className=" object-contain drop-shadow-xl scale-x-[1.7] scale-y-[1.65] translate-x-1/2"
              />

              {/* Booking card */}
              <div className="absolute -bottom-[60%] right-12 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700 z-10">
                {/* Boarding */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary-500 block" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Boarding</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Ajah Motor Park</p>
                  </div>
                </div>

                {/* Dotted connector */}
                <div className="ml-[5px] my-1 flex flex-col gap-[3px]">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600 block" />
                  ))}
                </div>

                {/* Destination */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <MapPin size={11} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Destination</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Ozumba Mbadiwe</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-dashed border-gray-200 dark:border-gray-700" />

                {/* Departure + Seat */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-gray-400">Departure</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">June 30 12:30PM</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Seat Number</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">Seats 15, 16, 17</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      
    </section>
  );
}
