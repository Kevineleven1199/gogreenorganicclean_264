import { motion } from "framer-motion";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { fadeUp } from "@/src/lib/animations";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

type ServiceCardProps = {
  title: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
};

export const ServiceCard = ({ title, description, highlights, icon: Icon }: ServiceCardProps) => (
  <motion.div variants={fadeUp}>
    <Card className="flex h-full flex-col justify-between bg-white">
      <CardHeader className="flex flex-col gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-accent shadow-sm shadow-brand-100/50">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold leading-tight text-accent">{title}</h3>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ul className="space-y-3 text-sm text-muted-foreground">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent/70" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          href="#quote"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-7 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
        >
          Get a Quote
        </Link>
      </CardContent>
    </Card>
  </motion.div>
);
