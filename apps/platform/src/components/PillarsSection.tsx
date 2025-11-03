"use client";

import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Sparkles, Flower } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { fadeUp, staggerContainer } from "@/src/lib/animations";

const PILLARS = [
  {
    title: "Eco Friendly",
    description:
      "We use only eco-conscious cleaning products that are thoroughly tested to be safe for your family, your pets, your home’s surfaces, and the planet.",
    icon: Leaf
  },
  {
    title: "Professional",
    description:
      "With years of experience in cleaning services, we pass our expertise directly to our teams through comprehensive in-house training.",
    icon: Sparkles
  },
  {
    title: "Security",
    description:
      "Each cleaner undergoes a thorough review process and must pass a mandatory police check and carry valid insurance—so you can enjoy complete peace of mind.",
    icon: ShieldCheck
  },
  {
    title: "Allergen Free",
    description:
      "We use only 100% natural, non-toxic products that are free from harsh chemicals and common allergens—creating a safe and healthy environment for you, your family, and your pets.",
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
