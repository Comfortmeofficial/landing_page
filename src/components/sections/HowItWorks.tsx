import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { steps } from '@/data/steps';
import { fadeInUp, staggerContainer } from '@/lib/utils';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-100 dark:bg-gray-950 py-24">
      <Container>
        <SectionHeader
          title={
            <>
              <span className="text-secondary-500">Three steps</span> to a better commute.
            </>
          }
          subtitle="We handle the details so you don't have to. From sign-up to your first ride, the whole process takes minutes."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={fadeInUp}
              className="relative rounded-2xl bg-white p-8 dark:bg-gray-900 shadow-sm"
            >
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-6 bg-gray-200 dark:bg-gray-700 sm:block" />
              )}

              <span className="block text-5xl font-black text-gray-100 dark:text-gray-800 select-none">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
