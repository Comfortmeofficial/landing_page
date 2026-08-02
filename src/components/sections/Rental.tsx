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
        className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #0d1b2e 0%, #091422 50%, #04080f 100%)' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center min-h-[260px]">
          {/* Left content */}
          <div className="relative z-10 flex-1 px-10 py-12 lg:py-14 lg:px-14 max-w-xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl leading-snug">
              Need A Bus For The Weekend?
            </h2>
            <p className="mt-4 text-gray-400 leading-relaxed text-sm sm:text-base">
              You handle the occasion. We handle the movement. From company retreats to weekend getaways, our premium 29-seater coasters seat up to 29 people and come with a professional driver. So the only thing your group needs to worry about is enjoying the journey. Coming soon.
            </p>
            <button className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors duration-200">
              Notify Me When Rentals Launch
            </button>
          </div>

          {/* Bus image — fills right side, bleeds out */}
          <div className="relative flex-1 flex items-end justify-end self-stretch min-h-[200px] lg:min-h-0">
            <img
              src="/need-a-bus.png"
              alt="Comfort Me coaster bus"
              className="absolute -right-56 top-0 h-full w-full object-cover object-left lg:object-contain lg:object-right-top scale-x-[-1]"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
