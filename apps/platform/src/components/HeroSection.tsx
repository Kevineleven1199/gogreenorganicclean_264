"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
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
      <div className="absolute inset-0 bg-black/65" />
    </div>

    <div className="section-wrapper relative flex flex-col items-center justify-center py-28 text-white sm:py-32 lg:py-40">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl rounded-[28px] border-2 border-white/70 bg-white/10 p-8 text-center shadow-[0_18px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur"
      >
        <h1 className="text-3xl font-semibold leading-relaxed md:text-4xl lg:text-[2.6rem]">
          Do You Need A Higher Standard Of Clean?
        </h1>
        <p className="mt-5 text-lg font-light leading-relaxed">
          Experience all-organic cleaning that protects your family, pets, and the planet.
        </p>
        <h2 className="mt-6 text-2xl font-semibold">Call Us Today: +1 (941) 271 – 7948</h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/get-a-quote"
            className="inline-flex items-center rounded-full bg-brand-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-emerald-900/30 transition hover:bg-brand-600"
          >
            Request a Free Quote
          </Link>
          <Link
            href="tel:+19412717948"
            className="inline-flex items-center rounded-full border border-white/80 bg-white/15 px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/25"
          >
            Call Us Today
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);
