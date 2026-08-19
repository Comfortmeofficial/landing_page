import { MousePointer2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { fadeInUp, staggerContainer } from '@/lib/utils';

export function CTA() {
  return (
    <section className="relative bg-gray-50 dark:bg-gray-900 py-32 overflow-hidden">
      {/* Decorative illustrations */}
      <img
        src="/green-illustration.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 w-[420px] max-w-none opacity-90"
      />
      <img
        src="/pink-illustration.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 w-[380px] max-w-none opacity-90"
      />

      <Container className="relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            The commute you
            <br />
            <span className="text-secondary-500">deserve</span>
            <br />
            is almost here.
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-lg text-base text-gray-500 dark:text-gray-400"
          >
            ComfortMe is launching soon. Join the waitlist and be among the first to experience a commute that actually feels good.
          </motion.p>

          <motion.div variants={fadeInUp} className="relative mt-10 inline-block">
            <Button variant="primary" size="lg" className="shadow-lg shadow-secondary-500/20 px-10 py-5 text-base">
              <a href="#contact">Count Me In</a>
            </Button>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 translate-x-1/2 text-[#EC4899]">
              <Sparkles size={14} className="absolute -top-3 -left-2" />
              <MousePointer2 size={20} className="rotate-[-8deg]" fill="currentColor" />
            </span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
