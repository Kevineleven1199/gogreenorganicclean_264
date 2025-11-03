"use client";

import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Sparkles, Flower } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { fadeUp, staggerContainer } from "@/src/lib/animations";

const PILLARS = [
  {
    title: "Eco Friendly",
    description: "We use only eco-conscious cleaning products tested safe for your family, pets, and planet.",
    icon: Leaf
  },
  {
    title: "Professional",
    description: "With years of experience, our teams receive comprehensive in-house training.",
    icon: Sparkles
  },
  {
    title: "Security",
    description: "All cleaners pass police checks and carry valid insurance.",
    icon: ShieldCheck
  },
  {
    title: "Allergen Free",
    description: "100% natural, non-toxic products free from harsh chemicals and allergens.",
    icon: Flower
  }
];

export const PillarsSection = () => (
  <section className="section-wrapper py-20">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      {PILLARS.map(({ title, description, icon: Icon }) => (
        <motion.div key={title} variants={fadeUp}>
          <Card className="h-full bg-white text-left">
            <CardHeader className="flex flex-col gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold text-accent">{title}</h3>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </section>
);
