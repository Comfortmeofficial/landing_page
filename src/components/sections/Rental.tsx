import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/utils';

export function Rental() {
  return (
    <section id="rental" className="bg-gray-50 dark:bg-gray-900 py-16 px-6 lg:px-8">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto rounded-[2rem] border-2 border-dashed border-[#7CAE7A] p-3"
      >
        <div className="relative overflow-hidden rounded-3xl bg-[#7CAE7A]">
          <div className="flex flex-col lg:flex-row lg:items-center min-h-[260px]">
            {/* Left content */}
            <div className="relative z-10 flex-1 px-10 py-12 lg:py-14 lg:px-14 max-w-xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl leading-snug">
                Need a bus for the weekend<span className="text-orange-500">?</span>
              </h2>
              <p className="mt-4 text-white/90 leading-relaxed text-sm sm:text-base">
                You handle the occasion. We handle the movement. Whether it's a company retreat or a weekend getaway, we show up with a 28-seater coaster bus and a professional driver ready to go so your group can focus on the moment.
              </p>
              <p className="mt-4 text-white/90 leading-relaxed text-sm sm:text-base">
                Weekend rentals are coming soon. Join the waitlist and be the first to know.
              </p>
              <button className="mt-8 inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition-colors duration-200">
                Notify Me When Rentals Launch
              </button>
            </div>

            {/* Bus image — bottom-anchored, bleeds off the right edge */}
            <div className="relative flex-1 flex items-end justify-end self-stretch min-h-[200px] lg:min-h-0">
              <img
                src="/bus-illustration.png"
                alt="Comfortme coaster bus"
                className="absolute right-0 bottom-0 h-full w-auto max-w-none object-contain object-right-bottom"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
