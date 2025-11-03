"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const STEPS = [
  {
    title: "Choose Your Service",
    description: "Select any service that fits your needs from our website.",
    icon: "/images/broom.png"
  },
  {
    title: "Book Your Appointment",
    description: "Pick a date and time that works for you.",
    icon: "/images/booking.png"
  },
  {
    title: "Enjoy a Spotless Home",
    description: "Our team arrives ready to clean—sit back and love the results!",
    icon: "/images/clean.png"
  }
];

export const HowItWorks = () => (
  <section className="section-wrapper py-20" id="checklist">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      className="mx-auto max-w-3xl text-center"
    >
      <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-accent md:text-4xl">
        How It Works
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-4 text-base text-muted-foreground">
        From booking to sparkling results in three simple steps.
      </motion.p>
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
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                <Image src={step.icon} alt={step.title} width={40} height={40} />
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
  </section>
);
