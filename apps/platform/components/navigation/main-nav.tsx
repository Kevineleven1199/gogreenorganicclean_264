"use client";

import Link from "next/link";
import Logo from "@/components/brand/logo";

const MainNav = () => (
  <header className="sticky top-6 z-40 flex items-center justify-between rounded-full border border-white/10 bg-slate-950/80 px-6 py-3 backdrop-blur">
    <Logo />
    <nav className="hidden items-center gap-6 text-sm font-semibold text-white/70 md:flex">
      <Link href="#features" className="hover:text-white">
        Features
      </Link>
      <Link href="#pricing" className="hover:text-white">
        Pricing
      </Link>
      <Link href="/community" className="hover:text-white">
        Neighbor feed
      </Link>
      <Link href="/login" className="hover:text-white">
        Log in
      </Link>
    </nav>
    <Link
      href="/signup"
      className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-brand-100 hover:text-brand-900"
    >
      Start free trial
    </Link>
  </header>
);

export default MainNav;
