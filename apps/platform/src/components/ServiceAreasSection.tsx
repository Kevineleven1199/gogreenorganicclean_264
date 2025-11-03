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
    <div className="section-wrapper grid gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="space-y-6"
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-accent md:text-4xl">
          Service Areas
        </motion.h2>
        <motion.p variants={fadeUp} className="text-base text-muted-foreground">
          We&rsquo;re thrilled to announce that we have expanded our service area to cover more homes! Our Organic Cleaning services are now reaching even more neighborhoods near you!
        </motion.p>
        <motion.div
          variants={staggerContainer}
          className="mt-8 space-y-4"
        >
          {AREAS.map((area) => (
            <motion.div key={area.title} variants={fadeUp} className="rounded-2xl border border-brand-100/70 bg-white px-6 py-4 shadow-sm">
              <h3 className="text-lg font-semibold text-accent">{area.title}</h3>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">
                {area.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-brand-100 shadow-xl"
      >
        <img
          src="/images/service-areas-map.svg"
          alt="Service coverage map for Sarasota and surrounding counties"
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  </section>
);
