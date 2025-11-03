"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
import { Button } from "@/src/components/ui/button";

export const ClientHubSection = () => (
  <section className="bg-white" id="client-hub">
    <div className="section-wrapper grid gap-8 py-16 text-center lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:text-left">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="space-y-4"
      >
        <h2 className="text-3xl font-semibold text-accent md:text-4xl">
          Client Hub Access
        </h2>
        <p className="text-base text-muted-foreground">
          Log in anytime to manage appointments, review invoices, update payment options, and stay in step with your cleaning schedule.
        </p>
        <Button asChild size="lg" className="mt-2 w-full sm:w-auto">
          <Link href="https://clienthub.getjobber.com/client_hubs/">
            Launch Client Hub
          </Link>
        </Button>
      </motion.div>
      <div className="hidden h-24 w-px bg-gradient-to-b from-brand-200 to-brand-500 lg:block" />
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="space-y-3 text-left text-sm text-muted-foreground"
      >
        <li>✔ Reschedule or adjust your bookings</li>
        <li>✔ View upcoming visits and service notes</li>
        <li>✔ Download invoices and receipts instantly</li>
        <li>✔ Communicate with our team in real time</li>
      </motion.ul>
    </div>
  </section>
);
