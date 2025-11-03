"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "#services" },
  { label: "Cleaning Checklist", href: "#checklist" },
  { label: "Get a Quote", href: "/get-a-quote" },
  { label: "Blogs", href: "#blogs" },
  { label: "Contact Us", href: "#contact" },
  { label: "Client Hub", href: "#client-hub" }
];

export const NavBar = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur shadow-sm">
      <div className="section-wrapper flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={close}>
          <Image
            src="/images/cropped-Mobile-Logo-164x76.png"
            alt="Go Green Organic Clean logo"
            width={164}
            height={76}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-accent md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors duration-200 hover:text-brand-500"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="outline" size="md" className="uppercase tracking-wide">
            <Link href="/get-a-quote">Get a Quote</Link>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-t border-emerald-50/80 bg-white/95 shadow-lg md:hidden"
          >
            <div className="section-wrapper flex flex-col gap-3 py-6">
              {LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={close}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-base font-semibold text-accent transition-colors hover:bg-brand-50/60 hover:text-brand-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild size="lg" className="w-full">
                <Link href="/get-a-quote" onClick={close}>
                  Get a Quote
                </Link>
              </Button>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
