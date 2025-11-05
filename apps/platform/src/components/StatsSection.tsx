"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";

const METRICS = [
  { value: "2,000+", label: "Florida homes and offices cleaned sustainably" },
  { value: "72 NPS", label: "Customer satisfaction score—well above industry average" },
  { value: "48 hrs", label: "Average time from quote request to first clean" }
];

export const StatsSection = () => (
  <section className="bg-white">
    <div className="section-wrapper py-14">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="grid gap-8 rounded-3xl border border-brand-100 bg-brand-50/60 px-8 py-10 text-center shadow-lg shadow-brand-100/50 md:grid-cols-3"
      >
        {METRICS.map((metric) => (
          <motion.div key={metric.value} variants={fadeUp} className="space-y-3">
            <p className="font-display text-3xl font-semibold text-accent sm:text-4xl">{metric.value}</p>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent/70">{metric.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);
