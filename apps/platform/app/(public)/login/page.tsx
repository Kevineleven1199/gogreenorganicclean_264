"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const OPTIONS = [
  {
    title: "Customer Portal",
    description: "View upcoming visits, approve quotes, and manage billing.",
    href: "/client"
  },
  {
    title: "Cleaner Portal",
    description: "Claim jobs, review schedules, and track payouts on the go.",
    href: "/cleaner"
  },
  {
    title: "Admin Portal",
    description: "Monitor service requests, configure automations, and manage tenants.",
    href: "/admin"
  }
];

const LoginPage = () => (
  <div className="bg-surface py-20">
    <div className="section-wrapper">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.h1 variants={fadeUp} className="text-3xl font-semibold text-accent md:text-4xl">
          Sign in to your GoGreen portal
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 text-base text-muted-foreground">
          Choose the experience tailored to your role. Authentication is coming soon; for now each portal is a guided preview.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mt-12 grid gap-6 lg:grid-cols-3"
      >
        {OPTIONS.map((option) => (
          <motion.div key={option.title} variants={fadeUp}>
            <Card className="h-full bg-white text-left">
              <CardHeader>
                <h2 className="text-xl font-semibold text-accent">{option.title}</h2>
              </CardHeader>
              <CardContent className="space-y-6 text-sm text-muted-foreground">
                <p>{option.description}</p>
                <Link
                  href={option.href}
                  className="inline-flex items-center rounded-full bg-brand-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand-600"
                >
                  Enter {option.title.split(" ")[0]} Portal
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
);

export default LoginPage;
