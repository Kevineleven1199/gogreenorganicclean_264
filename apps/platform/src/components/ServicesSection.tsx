"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";
import { ServiceCard } from "@/src/components/ServiceCard";

const SERVICES = [
  {
    title: "Regular Clean (Basic)",
    description:
      "Perfect for regular upkeep and a consistently fresh home. Includes dusting, vacuuming, and sanitizing high-touch areas.",
    image: "/images/Untitled-design-2-1.png"
  },
  {
    title: "Deep Clean",
    description:
      "Go beyond surface shine with our most detailed, top-to-bottom service—ideal for seasonal refreshes or preparing for guests.",
    image: "/images/Untitled-design-6-1.png"
  },
  {
    title: "Move In/Out Clean",
    description:
      "A full-detail cleaning package—perfect for move-ins and move-outs with meticulous appliance, cabinet, and baseboard care.",
    image: "/images/Untitled-design-7-1.png"
  }
];

export const ServicesSection = () => (
  <section className="bg-white" id="services">
    <div className="section-wrapper py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-accent md:text-4xl">
          Our Top Services
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-base text-muted-foreground">
          Explore our most requested services — Basic, Deep, and Move In/Out — all customizable with FREE estimates.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="mt-12 grid gap-6 lg:grid-cols-3"
      >
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            description={service.description}
            image={service.image}
            ctaHref="/get-a-quote"
          />
        ))}
      </motion.div>
    </div>
  </section>
);
