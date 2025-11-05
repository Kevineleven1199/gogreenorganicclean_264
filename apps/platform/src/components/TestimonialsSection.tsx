"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";

type Testimonial = {
  quote: string;
  name: string;
  location: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We switched to Go Green after our toddler developed allergies. The difference is incredible—no chemical smells, noticeably less dust, and their team is so thoughtful.",
    name: "Tara M.",
    location: "Sarasota, FL"
  },
  {
    quote:
      "As a wellness studio, we needed a partner who understood air quality and disinfection. Their green products keep our space spotless and our clients breathe easier.",
    name: "Javier R.",
    location: "St. Petersburg, FL"
  },
  {
    quote:
      "Move-out day was chaos until Go Green arrived. They handled every detail with eco products the landlord loved. We got our full deposit back and zero stress.",
    name: "Kaelyn S.",
    location: "Lakewood Ranch, FL"
  }
];

export const TestimonialsSection = () => (
  <section className="bg-white" id="testimonials">
    <div className="section-wrapper py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.span variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.3em] text-accent/70">
          Loved by Local Families
        </motion.span>
        <motion.h2 variants={fadeUp} className="mt-4 font-display text-3xl font-semibold leading-tight text-accent md:text-4xl">
          2,000+ Sarasota homes and workplaces cleaned the healthy way
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          With an NPS score of 72 and a five-star review record, our community trusts us to deliver a sparkling space that aligns with their values.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="mt-12 grid gap-6 md:grid-cols-3"
      >
        {TESTIMONIALS.map((testimonial) => (
          <motion.blockquote
            key={testimonial.name}
            variants={fadeUp}
            className="relative flex h-full flex-col justify-between rounded-3xl border border-brand-100/60 bg-white px-8 py-10 text-left shadow-lg shadow-brand-100/40"
          >
            <span className="absolute -top-6 left-8 text-5xl text-sunshine" aria-hidden="true">
              “
            </span>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {testimonial.quote}
            </p>
            <footer className="mt-8">
              <p className="text-base font-semibold text-accent">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
            </footer>
          </motion.blockquote>
        ))}
      </motion.div>
    </div>
  </section>
);
