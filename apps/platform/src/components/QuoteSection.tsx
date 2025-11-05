"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";
import { QuoteForm } from "@/src/components/QuoteForm";

export const QuoteSection = () => (
  <section className="bg-white" id="quote">
    <div className="section-wrapper grid gap-12 py-20 lg:grid-cols-2 lg:items-start">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="space-y-6"
      >
        <motion.span variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.3em] text-accent/70">
          Ready When You Are
        </motion.span>
        <motion.h2 variants={fadeUp} className="font-display text-3xl font-semibold leading-tight text-accent md:text-4xl">
          Request your eco-cleaning quote
        </motion.h2>
        <motion.p variants={fadeUp} className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Share a few details about your home or workplace and we’ll deliver a personalized quote, eco-product list, and availability within one business day. Prefer to talk now? Call{" "}
          <a href="tel:+19412717948" className="font-semibold text-accent underline underline-offset-4">
            (941) 271-7948
          </a>.
        </motion.p>
        <motion.ul variants={fadeUp} className="space-y-3 text-base text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sunshine" aria-hidden="true" />
            <span>Transparent pricing with no surprise fees—ever.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sunshine" aria-hidden="true" />
            <span>Add specialty services like inside appliances, windows, or realtor-ready staging.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sunshine" aria-hidden="true" />
            <span>Ask about recurring discounts for weekly, bi-weekly, or monthly cleanings.</span>
          </li>
        </motion.ul>
      </motion.div>
      <QuoteForm />
    </div>
  </section>
);
