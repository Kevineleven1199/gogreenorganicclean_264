"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
export const HeroSection = () => (
  <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100">
    <div className="absolute inset-0">
      <Image
        src="/images/Cleaning-2048x1365.jpeg"
        alt="A sunlit Florida kitchen being cleaned with eco-friendly products"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]" aria-hidden="true" />
    </div>

    <div className="section-wrapper relative flex flex-col items-start justify-center py-28 sm:py-32 lg:py-40">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl space-y-6">
        <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Sarasota • Eco-Friendly • Family Safe
        </span>
        <h1 className="font-display text-4xl font-semibold leading-tight text-accent sm:text-5xl lg:text-[3.25rem]">
          Sarasota’s Premier Organic Cleaning Service
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Breathe easier with an all-natural clean that protects your family, pets, and the planet. We pair certified green products with a trusted local crew for sparkling results every visit.
        </p>
        <ul className="grid gap-3 text-base text-muted-foreground sm:grid-cols-2">
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-sunshine" aria-hidden="true" />
            <span>EPA Safer Choice & Green Seal certified supplies</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-sunshine" aria-hidden="true" />
            <span>Safe for kids, pets, and sensitive indoor air</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-sunshine" aria-hidden="true" />
            <span>Locally owned & insured Sarasota professionals</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-sunshine" aria-hidden="true" />
            <span>Flexible scheduling for homes and workplaces</span>
          </li>
        </ul>
        <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center">
          <Link
            href="#quote"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-accent px-10 py-3 text-base font-semibold uppercase tracking-[0.12em] text-white shadow-brand transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          >
            Get a Free Quote
          </Link>
          <Link
            href="tel:+19412717948"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-accent/20 bg-white px-10 py-3 text-base font-semibold uppercase tracking-[0.12em] text-accent shadow-sm transition hover:border-accent/40 hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          >
            Call (941) 271-7948
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);
