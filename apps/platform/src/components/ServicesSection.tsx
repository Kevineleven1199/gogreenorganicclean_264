"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";
import { ServiceCard } from "@/src/components/ServiceCard";

export const ServicesSection = () => (
  <section className="bg-gradient-to-r from-brand-50 via-white to-brand-50" id="services">
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
          Explore our most requested services — Basic, Deep, and Move In/Out —<br />all customizable with FREE estimates. Looking for more?
          <a className="text-brand-600 underline underline-offset-4" href="https://gogreenorganicclean.com/services/" target="_blank" rel="noopener noreferrer">
            {" "}We also provide a full suite of special services
          </a>{" "}
          to fit your property perfectly.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="mt-12 grid gap-6 lg:grid-cols-3"
      >
        <ServiceCard
          title="Regular Clean (Basic)"
          image="/images/Untitled-design-2-1.png"
          ctaHref="https://gogreenorganicclean.com/get-a-quote/"
        >
          <p>
            <strong>Perfect for regular upkeep and a consistently fresh home.</strong>
          </p>
          <p>
            Our Standard Cleaning covers the essentials that make the biggest daily impact: dusting reachable surfaces, vacuuming and mopping floors, sanitizing sinks, countertops, and bathrooms, wiping mirrors, changing linens, and making beds. It’s designed to keep your home looking and feeling great between deeper cleans every single time.
          </p>
          <p>
            <strong>👉 Ideal for:</strong> Weekly or bi-weekly maintenance, busy households, or anyone wanting a reliable clean without the extras!
          </p>
        </ServiceCard>

        <ServiceCard
          title="Deep Clean"
          image="/images/Untitled-design-6-1.png"
          ctaHref="https://gogreenorganicclean.com/get-a-quote/"
        >
          <p>
            Go beyond surface shine with our <strong>most detailed, top-to-bottom service.</strong> Deep Cleaning includes everything in our Standard package plus attention to often-missed areas like baseboards, wall art, ceiling fans, furniture surfaces, lamps, and appliance exteriors. Bathrooms and kitchens get extra scrubbing to remove soap scum, polish fixtures, and restore that sparkling finish.
          </p>
          <p>
            <strong>👉 Ideal for:</strong> Seasonal refreshes, special occasions, or when your home needs a reset beyond routine cleaning.
          </p>
        </ServiceCard>

        <ServiceCard
          title="Move In/Out Clean"
          image="/images/Untitled-design-7-1.png"
          ctaHref="https://gogreenorganicclean.com/get-a-quote/"
        >
          <p>
            <strong>A full-detail cleaning package — perfect for move-ins and move-outs.</strong>
          </p>
          <p>
            Move In/Out Cleaning includes every detail of our Deep Clean, with added focus on preparing a home for its next chapter: inside cabinets and drawers, inside appliances (oven, fridge, microwave), garage sweep, detailed baseboards, and interior windows. We leave no corner untouched so you can hand over the keys with confidence — or step into a fresh, spotless home.
          </p>
          <p>
            <strong>👉 Ideal for:</strong> Tenants securing deposits, landlords prepping for new occupants, or families moving into a new home.
          </p>
        </ServiceCard>
      </motion.div>
    </div>
  </section>
);
