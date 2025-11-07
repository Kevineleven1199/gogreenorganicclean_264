"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoutButton } from "@/src/components/LogoutButton";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

type NavBarSession = {
  name: string;
  role: "HQ" | "CLEANER" | "CUSTOMER";
};

type NavBarProps = {
  session?: NavBarSession | null;
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

const PORTAL_LINK: Record<NavBarSession["role"], string> = {
  HQ: "/admin",
  CLEANER: "/cleaner",
  CUSTOMER: "/client"
};

export const NavBar = ({ session }: NavBarProps) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);
  const portalHref = session ? PORTAL_LINK[session.role] : null;
  const portalLabel = useMemo(() => {
    if (!session) return null;
    if (session.role === "HQ") return "Admin Portal";
    if (session.role === "CLEANER") return "Crew Portal";
    return "Client Portal";
  }, [session]);

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
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-700">{portalLabel}</span>
                <Link
                  href={portalHref ?? "/login"}
                  className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-brand-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent transition hover:border-brand-300 hover:text-brand-700"
                >
                  Open Portal
                </Link>
                <LogoutButton className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground hover:text-accent" />
              </>
            ) : (
              <>
                <Link href="/login" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground hover:text-accent">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-brand-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent transition hover:border-brand-300 hover:text-brand-700"
                >
                  Register
                </Link>
              </>
            )}
            <Link
              href="#quote"
              className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-accent px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-brand transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
            >
              Get a Quote
            </Link>
          </div>
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
              <div className="flex flex-col gap-3 pt-4">
                {session ? (
                  <>
                    <Link
                      href={portalHref ?? "/login"}
                      onClick={close}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-brand-200 px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-accent"
                    >
                      Open {portalLabel}
                    </Link>
                    <LogoutButton
                      variant="button"
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-accent bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent"
                    />
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={close}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-brand-200 px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-accent"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={close}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-brand-200 px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-accent"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
