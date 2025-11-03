"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

type ServiceCardProps = {
  title: string;
  image: string;
  ctaHref: string;
  children: React.ReactNode;
};

export const ServiceCard = ({ title, image, ctaHref, children }: ServiceCardProps) => (
  <motion.div variants={fadeUp}>
    <Card className="group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardHeader className="px-6 pt-6">
        <h3 className="text-xl font-semibold text-accent">{title}</h3>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <div className="space-y-4 text-sm text-muted-foreground">{children}</div>
        <Link
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-brand transition hover:bg-brand-600 sm:w-auto"
        >
          Book Now
        </Link>
      </CardContent>
    </Card>
  </motion.div>
);
