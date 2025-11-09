import Link from "next/link";
import { LogoutButton } from "@/src/components/LogoutButton";
import { requireSession } from "@/src/lib/auth/session";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Pipeline", href: "/admin/pipeline" },
  { label: "Service Requests", href: "/admin/requests" },
  { label: "Automations", href: "/admin/automations" },
  { label: "Integrations", href: "/admin/integrations" }
];

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const session = await requireSession({ roles: ["HQ"], redirectTo: "/admin" });

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-emerald-100 bg-white">
        <div className="section-wrapper flex h-16 items-center justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.4em] text-accent">
            GoGreen Admin
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

export default AdminLayout;
