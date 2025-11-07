import Link from "next/link";
import { LogoutButton } from "@/src/components/LogoutButton";
import { requireSession } from "@/src/lib/auth/session";

type ClientLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Overview", href: "/client" },
  { label: "Upcoming Visits", href: "/client/visits" },
  { label: "Quotes", href: "/client/quotes" },
  { label: "Billing", href: "/client/billing" }
];

const ClientLayout = async ({ children }: ClientLayoutProps) => {
  const session = await requireSession({ roles: ["CUSTOMER", "HQ"], redirectTo: "/client" });

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-emerald-100 bg-white">
        <div className="section-wrapper flex h-16 items-center justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.4em] text-accent">
            GoGreen Client Hub
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-accent/80 md:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-brand-600">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-semibold uppercase tracking-[0.3em] text-brand-600 md:inline">
              {session.name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="section-wrapper py-12">{children}</main>
    </div>
  );
};

export default ClientLayout;
