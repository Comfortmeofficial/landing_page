import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { benefits } from '@/data/benefits';
import { fadeInUp, staggerContainer } from '@/lib/utils';

export function Benefits() {
  const leftItems = benefits.filter((b) => b.side === 'left');
  const rightItems = benefits.filter((b) => b.side === 'right');

  return (
    <section id="benefits" className="bg-primary-500 pt-8">
      <Container className="pt-20 pb-8">
        <SectionHeader
          title="Built for Modern Commuters"
          subtitle="Whether you're heading to work, school, or an important appointment, Comfort Me gives you the tools to plan, book, and ride without the usual stress."
          light
        />

        <div className="mt-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
          {/* Left benefits */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10"
          >
            {leftItems.map((item) => {
              return (
                <motion.div key={item.title} variants={fadeInUp} className="text-right">
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    </div>
                    <p className="text-sm leading-relaxed text-white/70 max-w-xs">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-[3rem] bg-white/10 blur-xl" />
              <img
                src="/iphone-x.png"
                alt="Comfort Me app on iPhone"
                className="relative z-10 w-56 drop-shadow-2xl sm:w-64 lg:w-72"
              />
            </div>
          </motion.div>

          {/* Right benefits */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10"
          >
            {rightItems.map((item) => {
              return (
                <motion.div key={item.title} variants={fadeInUp}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-400" />
                      <h3 className="font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70 max-w-xs">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>

      {/* Bottom wave out of blue section */}
      <div aria-hidden>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="h-20 w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,40 Q360,0 720,40 Q1080,80 1440,40 L1440,80 L0,80 Z" className="fill-white dark:fill-gray-900" />
        </svg>
      </div>
    </section>
  );
}
