"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const STEPS = [
  {
    title: "Choose Your Service",
    description:
      "Select any of our services that fits your needs, all from the comfort of our website or a quick call.",
    icon: "/images/broom.png"
  },
  {
    title: "Book Your Appointment",
    description:
      "Reserve your cleaning slot with ease—pick a date and time that works for you, and we’ll handle the rest.",
    icon: "/images/booking.png"
  },
  {
    title: "Enjoy a Spotless Home",
    description:
      "Our team arrives ready to clean, leaving your space fresh and tidy. Sit back and love the results!",
    icon: "/images/clean.png"
  }
];

export const HowItWorks = () => (
  <section className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800" id="checklist">
    <div className="section-wrapper py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="mx-auto max-w-3xl text-center text-white"
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-semibold md:text-4xl">
          How Our Service Works
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="mt-12 grid gap-6 lg:grid-cols-3"
      >
        {STEPS.map((step) => (
          <motion.div key={step.title} variants={fadeUp}>
            <Card className="h-full bg-white text-center">
              <CardHeader className="flex flex-col items-center gap-4">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
                  <Image src={step.icon} alt={step.title} width={64} height={64} />
                </span>
                <h3 className="text-lg font-semibold text-accent">{step.title}</h3>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{step.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);
