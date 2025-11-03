"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";

export const AboutSection = () => (
  <section className="bg-surface" id="who-we-are">
    <div className="section-wrapper grid gap-10 py-20 md:grid-cols-2 md:items-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="space-y-6"
      >
        <motion.span variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">
          Professional All-Organic Cleaning Services in Sarasota, FL
        </motion.span>
        <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-accent md:text-4xl">
          A healthier clean for every room
        </motion.h2>
        <motion.p variants={fadeUp} className="text-base leading-relaxed text-muted-foreground">
          At <strong>Go Green Organic Clean</strong>, we believe a spotless home or workplace shouldn’t come at the expense of your health. That’s why we use only eco-friendly, non-toxic products that are safe for your family, pets, and the planet.
        </motion.p>
        <motion.p variants={fadeUp} className="text-base leading-relaxed text-muted-foreground">
          As Sarasota’s <strong>top-rated organic cleaning company</strong>, we take pride in delivering detail-driven results and a healthier clean you can trust. Whether it’s a one-time refresh or ongoing care, our team is here to make your space shine.
        </motion.p>
        <motion.p variants={fadeUp} className="text-base font-semibold uppercase tracking-[0.2em] text-brand-700">
          We provide free, no-obligation quotes — call us today to schedule your estimate.
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl shadow-lg shadow-brand-100"
      >
        <Image
          src="/images/Review-1024x989.png"
          alt="Eco friendly cleaning team testimonial"
          width={900}
          height={640}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  </section>
);
