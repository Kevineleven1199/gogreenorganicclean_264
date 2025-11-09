import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const quickLinks = [
  {
    title: "View Pipeline",
    description: "Track each home from intake to payout and spot reschedules instantly.",
    href: "/admin/pipeline"
  },
  {
    title: "Review New Requests",
    description: "Approve or adjust incoming quotes before they reach your customers.",
    href: "/admin/requests"
  },
  {
    title: "Manage Team",
    description: "Invite new HQ managers or cleaners and view real-time crew stats.",
    href: "/admin/team"
  },
  {
    title: "Configure Automations",
    description: "Fine-tune job routing, notifications, and revenue splits for each tenant.",
    href: "/admin/automations"
  },
  {
    title: "Manage Integrations",
    description: "Connect OpenPhone, payments, and calendar sync across every market.",
    href: "/admin/integrations"
  }
];

const AdminHome = () => (
  <div className="grid gap-6 lg:grid-cols-3">
    <Card className="lg:col-span-3 bg-white">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-accent">Welcome back, GoGreen HQ</h1>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          This admin portal centralizes every tenant, crew, and automation. We&rsquo;re currently surfacing a read-only preview while the
          authentication layer is under construction. Use the quick links below to explore the upcoming management flows.
        </p>
        <p>
          Want cleaners or customers to have their own experience? <Link href="/login" className="text-brand-600">Switch portals</Link> to
          view the dedicated interfaces.
        </p>
      </CardContent>
    </Card>

    {quickLinks.map((item) => (
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
            View Section
          </Link>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default AdminHome;
