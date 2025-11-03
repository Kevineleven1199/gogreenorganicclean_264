"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
import { Button } from "@/src/components/ui/button";

export const HeroSection = () => (
  <section className="relative isolate overflow-hidden">
    <div className="absolute inset-0">
      <Image
        src="/images/Cleaning-2048x1365.jpeg"
        alt="Cleaner wiping a countertop in a bright kitchen"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 gradient-overlay opacity-70 mix-blend-multiply" />
    </div>

    <div className="section-wrapper relative flex flex-col gap-10 py-32 text-white lg:py-40">
      <motion.span
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="inline-flex w-fit items-center rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
      >
        Sarasota’s leading organic cleaning experts
      </motion.span>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.05, duration: 0.7 }}
        className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
      >
        Do You Need A Higher Standard Of Clean?
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1, duration: 0.7 }}
        className="max-w-2xl text-lg text-white/85"
      >
        Experience all-organic cleaning that protects your family, pets, and the planet. We deliver meticulous care with non-toxic products and eco-conscious practices across Sarasota and surrounding counties.
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.15, duration: 0.7 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <Button asChild size="lg" className="px-8 text-base shadow-lg shadow-emerald-900/30">
          <Link href="/get-a-quote">Request a Free Quote</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-white/70 bg-white/10 px-8 text-base text-white hover:bg-white/20 hover:text-white"
        >
          <Link href="tel:+19412717948">Call Us Today: +1 (941) 271–7948</Link>
        </Button>
      </motion.div>
    </div>
  </section>
);
