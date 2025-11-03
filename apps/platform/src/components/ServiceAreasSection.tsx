"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";

const AREAS = [
  { title: "Sarasota County", subtitle: "HQ Location" },
  { title: "Manatee County", subtitle: "Newly Added" },
  { title: "Pasco County", subtitle: "Newly Added" },
  { title: "Pinellas County", subtitle: "Newly Added" },
  { title: "Hillsborough County", subtitle: "Newly Added" }
];

export const ServiceAreasSection = () => (
  <section className="bg-surface" id="areas">
    <div className="section-wrapper py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-accent md:text-4xl">
          Service Areas
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-base text-muted-foreground">
          We’re thrilled to announce that we have expanded our service area to cover more homes! Our Organic Cleaning services are now reaching even more neighborhoods near you!
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
      >
        {AREAS.map((area) => (
          <motion.div key={area.title} variants={fadeUp} className="flex h-full flex-col items-center justify-center rounded-3xl border border-brand-100 bg-white px-4 py-6 text-center shadow-sm shadow-brand-100/60">
            <h3 className="text-lg font-semibold text-accent">{area.title}</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">
              {area.subtitle}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);
