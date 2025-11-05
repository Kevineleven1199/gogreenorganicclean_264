"use client";

import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Sparkles, Flower } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { fadeUp, staggerContainer } from "@/src/lib/animations";

const PILLARS = [
  {
    title: "Certified Green Products",
    description:
      "We clean with EPA Safer Choice and Green Seal certified supplies—no synthetic fragrances, dyes, or harsh residues left behind.",
    icon: Leaf
  },
  {
    title: "Healthy Indoor Air",
    description:
      "Our low-VOC process reduces allergens and improves air quality, protecting sensitive lungs, kids, and pets throughout your space.",
    icon: Flower
  },
  {
    title: "Local & Insured Team",
    description:
      "A Sarasota-based crew you can trust. Every technician is carefully vetted, fully insured, and trained to our five-star standards.",
    icon: ShieldCheck
  },
  {
    title: "Flexible Scheduling",
    description:
      "From weekly home refreshes to post-renovation detailing, we tailor every visit to your calendar, property, and priorities.",
    icon: Sparkles
  }
];

export const PillarsSection = () => (
  <section className="section-wrapper py-20" id="why-green">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="mx-auto max-w-3xl text-center"
    >
      <motion.span variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.3em] text-accent/70">
        Why Go Green?
      </motion.span>
      <motion.h2 variants={fadeUp} className="mt-4 font-display text-3xl font-semibold leading-tight text-accent md:text-4xl">
        A safer clean for your home, your family, and Florida’s coast
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
        We combine verified eco-friendly products with thoughtful processes, so you can enjoy a beautifully clean space without compromising your air, water, or wellbeing.
      </motion.p>
    </motion.div>

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      {PILLARS.map(({ title, description, icon: Icon }) => (
        <motion.div key={title} variants={fadeUp}>
          <Card className="h-full bg-white text-left">
            <CardHeader className="flex flex-col gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-accent">{title}</h3>
            </CardHeader>
            <CardContent className="text-base leading-relaxed text-muted-foreground">
              <p>{description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </section>
);
