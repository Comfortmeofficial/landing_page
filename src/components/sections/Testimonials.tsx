import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { testimonials } from '@/data/testimonials';
import { fadeInUp, staggerContainer } from '@/lib/utils';

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-white dark:bg-gray-900 py-24">
      <Container>
        {/* Title with "Testers" in blue */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
        >
          What Our Alpha{' '}
          <span className="text-secondary-500">Testers</span>{' '}
          Say
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={fadeInUp}
              className="flex flex-col gap-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
            >
              <StarRating count={t.rating} />
              <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {t.text}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
