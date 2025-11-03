"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
export const PromoBanner = () => (
  <section className="bg-accent text-white">
    <div className="section-wrapper flex flex-col items-center justify-between gap-4 py-8 text-center sm:flex-row sm:text-left">
      <motion.h5
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-lg font-semibold tracking-wide"
      >
        Special Savings! Book For This Saturday And Get 10% Off!
      </motion.h5>
      <Link
        href="tel:+19412717948"
        className="inline-flex items-center rounded-full border border-white/70 bg-white/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/25"
      >
        Contact Us
      </Link>
    </div>
  </section>
);
