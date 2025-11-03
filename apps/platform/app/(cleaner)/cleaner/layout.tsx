import Link from "next/link";

type CleanerLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Today", href: "/cleaner" },
  { label: "Job Board", href: "/cleaner/jobs" },
  { label: "Schedule", href: "/cleaner/schedule" },
  { label: "Payouts", href: "/cleaner/payouts" }
];

const CleanerLayout = ({ children }: CleanerLayoutProps) => (
  <div className="min-h-screen bg-surface">
    <header className="border-b border-emerald-100 bg-white">
      <div className="section-wrapper flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.4em] text-accent">
          GoGreen Crew Hub
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-accent/80 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="hover:text-brand-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/login" className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
          Switch Portal
        </Link>
      </div>
    </header>
    <main className="section-wrapper py-12">{children}</main>
  </div>
);

export default CleanerLayout;
