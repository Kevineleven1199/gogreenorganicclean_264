"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services" },
  { label: "Why Green", href: "#why-green" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#quote" }
];

export const NavBar = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-50 bg-white/95 shadow-sm backdrop-blur">
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

        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={close}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="transition-colors duration-200 hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#quote"
            className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-brand transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          >
            Get a Quote
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden rounded-full border border-brand-100 bg-white px-3 py-2 text-accent shadow-sm transition hover:bg-brand-50/60"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-t border-brand-50 bg-white/98 shadow-lg md:hidden"
          >
            <div className="section-wrapper flex flex-col gap-3 py-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={close}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-base font-semibold text-accent shadow-sm transition hover:bg-brand-50/70 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#quote"
                onClick={close}
                className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-brand transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
              >
                Book Your Clean
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
