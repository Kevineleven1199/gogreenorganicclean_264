"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
import { Button } from "@/src/components/ui/button";

export const PromoBanner = () => (
  <section className="bg-accent text-white">
    <div className="section-wrapper flex flex-col items-center justify-between gap-4 py-10 text-center sm:flex-row sm:text-left">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-lg font-semibold"
      >
        Special Savings! Book For This Saturday And Get 10% Off!
      </motion.p>
      <Button asChild size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white/20">
        <Link href="tel:+19412717948">Contact Us</Link>
      </Button>
    </div>
  </section>
);
