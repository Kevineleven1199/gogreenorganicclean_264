"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const POSTS = [
  {
    title: "6 Reasons to Switch to Organic Cleaning Products",
    excerpt: "Discover how eco-conscious ingredients create a safer home for families, pets, and allergy sufferers.",
    href: "https://gogreenorganicclean.com/blog"
  },
  {
    title: "Deep Clean Checklist: What We Cover In Every Visit",
    excerpt: "From baseboards to vent covers, explore the detail our Sarasota crew brings to seasonal refreshes.",
    href: "https://gogreenorganicclean.com/blog"
  }
];

export const BlogTeaser = () => (
  <section className="section-wrapper py-20" id="blogs">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="mx-auto max-w-3xl text-center"
    >
      <motion.h2 variants={fadeUp} className="text-3xl font-semibold text-accent md:text-4xl">
        Cleaning Tips & Insights
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-4 text-base text-muted-foreground">
        Stay inspired with sustainable cleaning ideas, maintenance checklists, and allergen-friendly advice.
      </motion.p>
    </motion.div>

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      className="mt-12 grid gap-6 lg:grid-cols-2"
    >
      {POSTS.map((post) => (
        <motion.div key={post.title} variants={fadeUp}>
          <Card className="h-full bg-white">
            <CardHeader>
              <h3 className="text-xl font-semibold text-accent">{post.title}</h3>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{post.excerpt}</p>
              <Link href={post.href} className="text-brand-600 underline underline-offset-4">
                Read more
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </section>
);
