"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

type NavChild = { label: string; href: string; external?: boolean };

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Our Services",
    href: "https://gogreenorganicclean.com/services/",
    children: [
      { label: "Basic House Cleaning", href: "https://gogreenorganicclean.com/services/basic-house-cleaning/" },
      { label: "Deep Clean/Spring Clean", href: "https://gogreenorganicclean.com/services/deep-clean-spring-clean/" },
      { label: "Move In/Out Clean", href: "https://gogreenorganicclean.com/services/move-in-out-clean/" },
      { label: "Post Construction Clean", href: "https://gogreenorganicclean.com/services/post-construction-clean-renovation-clean/" }
    ]
  },
  { label: "Cleaning Checklist", href: "https://gogreenorganicclean.com/cleaning-checklist/", external: true },
  { label: "Get A Quote", href: "/get-a-quote" },
  { label: "Blogs", href: "https://gogreenorganicclean.com/blogs/", external: true },
  { label: "Contact Us", href: "https://gogreenorganicclean.com/contact-us/", external: true },
  {
    label: "Client Hub (Existing Clients)",
    href: "https://clienthub.getjobber.com/client_hubs/673ae331-9239-4519-9c87-1e80f6f36412/login/new?source=share_login",
    external: true
  }
];

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [activeMobile, setActiveMobile] = useState<string | null>(null);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);
  const toggleMobileChild = (label: string) => {
    setActiveMobile((prev) => (prev === label ? null : label));
  };

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
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className={cn("relative flex items-center", item.children && "group")}> 
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1 transition-colors duration-200 hover:text-brand-500"
              >
                {item.label}
                {item.children ? <ChevronDown className="h-4 w-4" /> : null}
              </Link>
              {item.children ? (
                <div className="invisible absolute left-0 top-full z-30 mt-4 w-64 rounded-2xl border border-emerald-100 bg-white/95 p-4 opacity-0 shadow-xl shadow-emerald-100/40 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <ul className="space-y-3 text-sm">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          target={child.external ? "_blank" : "_blank"}
                          rel="noopener noreferrer"
                          className="block rounded-xl px-3 py-2 hover:bg-brand-50/80 hover:text-brand-600"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden rounded-full border border-emerald-100/70 bg-white px-3 py-2 text-accent shadow-sm transition hover:bg-brand-50/60"
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
            className="border-t border-emerald-50/80 bg-white/95 shadow-lg md:hidden"
          >
            <div className="section-wrapper flex flex-col gap-3 py-6">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <Link
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={() => {
                      if (!item.children) close();
                    }}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-base font-semibold text-accent shadow-sm transition hover:bg-brand-50/70 hover:text-brand-600"
                  >
                    {item.label}
                    {item.children ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          toggleMobileChild(item.label);
                        }}
                        aria-label={`Toggle ${item.label}`}
                      >
                        <ChevronDown className={cn("h-5 w-5 transition-transform", activeMobile === item.label && "rotate-180")} />
                      </button>
                    ) : null}
                  </Link>
                  {item.children && activeMobile === item.label ? (
                    <div className="ml-4 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={close}
                          className="block rounded-xl bg-white px-4 py-2 text-sm font-medium text-accent/80 shadow-sm transition hover:bg-brand-50/80 hover:text-brand-600"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
