"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

type ServiceCardProps = {
  title: string;
  description: string;
  image: string;
  ctaHref: string;
};

export const ServiceCard = ({ title, description, image, ctaHref }: ServiceCardProps) => (
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
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button asChild size="md" className="mt-6 w-full sm:w-auto">
          <Link href={ctaHref}>Book Now</Link>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);
