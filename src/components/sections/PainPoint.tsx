import { motion } from 'framer-motion';

export function PainPoint() {
  return (
    <section className="relative overflow-hidden">
      {/* Blue arch wave from Features section */}
      <div className="absolute top-0 left-0 right-0 z-10" aria-hidden>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="h-20 w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 Q720,80 1440,0 L1440,0 L0,0 Z" fill="#0058BC" />
        </svg>
      </div>

      {/* Background image + dark overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/9am-meeting.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/65" aria-hidden />

      {/* Content */}
      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <h2 id="benefits" className="text-4xl font-black text-white leading-tight sm:text-5xl lg:text-6xl">
            Lagos traffic doesn't care about your
          </h2>
          <h2 className="text-4xl font-black text-[#115ef2] leading-tight sm:text-5xl lg:text-6xl mt-2">
            9 AM meeting.
          </h2>
          <p className="mt-8 text-base leading-relaxed text-white/75 max-w-2xl mx-auto sm:text-lg">
            Most people accept the chaos as part of the deal. We never did. So we built something better. A ride that shows up on time, treats you with respect, and makes the journey itself worth something.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
