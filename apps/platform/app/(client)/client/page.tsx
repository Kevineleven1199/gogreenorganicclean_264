import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { formatCurrency } from "@/src/lib/utils";
import { getSession } from "@/src/lib/auth/session";
import { getClientPortalData } from "@/src/lib/client-portal";

const quickActions = [
  { label: "Request add-ons", href: "/request" },
  { label: "Share entry notes", href: "/client/visits" },
  { label: "Review invoices", href: "/client/billing" }
];

const ClientHome = async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const portalData = await getClientPortalData(session.email);
  const nextVisit = portalData.upcomingVisits[0];
  const nextInvoice = portalData.outstandingInvoices[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-3 bg-white">
        <CardHeader className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">Welcome back</p>
          <h1 className="text-2xl font-semibold text-accent">Hi {portalData.customerName || session.name}, here’s what’s next</h1>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
          <div className="rounded-3xl border border-brand-100 bg-brand-50/40 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Next visit</p>
            {nextVisit ? (
              <>
                <p className="mt-2 text-xl font-semibold text-accent">
                  {nextVisit.dateLabel} • {nextVisit.window}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{nextVisit.service}</p>
                <p className="text-xs text-muted-foreground">{nextVisit.address}</p>
                <Link href="/client/visits" className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
                  Manage visits →
                </Link>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">We’ll post your schedule here once a visit is confirmed.</p>
            )}
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white p-4 shadow-inner">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Billing snapshot</p>
            {nextInvoice ? (
              <>
                <p className="mt-2 text-xl font-semibold text-accent">{formatCurrency(nextInvoice.balance)}</p>
                <p className="text-sm text-muted-foreground">
                  {nextInvoice.service} • {nextInvoice.city}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nextInvoice.status === "deposit" ? "Deposit remaining" : "Balance due"} · Quote #{nextInvoice.quoteId.slice(0, 6)}
                </p>
                <Link href="/client/billing" className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
                  Pay invoice →
                </Link>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">You’re all caught up. We’ll show outstanding invoices here.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <h2 className="text-lg font-semibold text-accent">Quick stats</h2>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent/80">Total visits</p>
            <p className="text-2xl font-semibold text-accent">{portalData.totalRequests}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent/80">Upcoming visits</p>
            <p className="text-2xl font-semibold text-accent">{portalData.upcomingVisits.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent/80">Open invoices</p>
            <p className="text-2xl font-semibold text-accent">{portalData.outstandingInvoices.length}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white lg:col-span-2">
        <CardHeader>
          <h2 className="text-lg font-semibold text-accent">Quick actions</h2>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-3xl border border-brand-100 bg-brand-50/40 px-4 py-6 text-center font-semibold text-accent transition hover:border-brand-200 hover:bg-white"
            >
              {action.label}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientHome;
