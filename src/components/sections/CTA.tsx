import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { fadeInUp, staggerContainer } from '@/lib/utils';

export function CTA() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-32">
      <Container>
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
            The Better Way to
            <br />
            <span className="text-secondary-500">Move</span>
            {' '}Is{' '}
            <span className="text-secondary-500">Here.</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="mt-6 text-base text-gray-500 dark:text-gray-400"
          >
            Don't miss out on the launch. Join 10,000+ early adopters waiting for a better way to move.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-10">
            <Button variant="primary" size="lg" className="shadow-lg shadow-secondary-500/20 px-10 py-5 text-base">
              <a href="#contact">Join the Waitlist Now</a>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
