import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const actions = [
  {
    title: "View Upcoming Visits",
    description: "See the date, crew, and service checklist for each scheduled clean.",
    href: "/client/visits"
  },
  {
    title: "Approve Quotes",
    description: "Review new proposals, adjust availability, and approve in a tap.",
    href: "/client/quotes"
  },
  {
    title: "Manage Billing",
    description: "Update payment methods, download invoices, and track receipts.",
    href: "/client/billing"
  }
];

const ClientHome = () => (
  <div className="grid gap-6 lg:grid-cols-3">
    <Card className="lg:col-span-3 bg-white">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-accent">Welcome to your client hub</h1>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Track every cleaning in one place. This preview illustrates the upcoming customer portal where you&rsquo;ll manage schedules, quotes,
          communication, and billing once authentication is enabled.
        </p>
        <p>
          Need admin-level access? <Link href="/login" className="text-brand-600">Return to the portal selector</Link> to switch roles.
        </p>
      </CardContent>
    </Card>

    {actions.map((item) => (
      <Card key={item.title} className="bg-white">
        <CardHeader>
          <h2 className="text-lg font-semibold text-accent">{item.title}</h2>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{item.description}</p>
          <Link
            href={item.href}
            className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand-600"
          >
            Preview
          </Link>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default ClientHome;
