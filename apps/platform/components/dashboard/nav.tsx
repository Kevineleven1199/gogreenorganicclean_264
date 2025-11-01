"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/logo";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/requests", label: "Requests" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/community", label: "Community" },
  { href: "/clients", label: "Clients" },
  { href: "/settings", label: "Settings" }
];

type DashboardNavProps = {
  tenantSlug: string;
};

const DashboardNav = ({ tenantSlug }: DashboardNavProps) => {
  const pathname = usePathname();

  return (
    <aside className="glass sticky top-6 hidden h-[calc(100vh-48px)] w-72 flex-col rounded-3xl p-6 text-white lg:flex">
      <Logo className="justify-center" />
      <div className="mt-8 space-y-1">
        {links.map((link) => {
          const href = `/${tenantSlug}${link.href}`;
          const active =
            pathname === href || pathname?.startsWith(`${href}/`);

          return (
            <Link
              key={link.href}
              href={href}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-white/15 text-white shadow-brand"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{link.label}</span>
              <span className="text-xs text-white/40">→</span>
            </Link>
          );
        })}
      </div>
      <div className="mt-auto rounded-2xl bg-white/10 p-4 text-xs text-white/70">
        <p className="font-semibold text-white">Automation status</p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-center justify-between">
            <span>Quote engine</span>
            <span className="text-emerald-300">Active</span>
          </li>
          <li className="flex items-center justify-between">
            <span>OpenPhone</span>
            <span className="text-emerald-300">Connected</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Payments</span>
            <span className="text-amber-300">Action required</span>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default DashboardNav;
