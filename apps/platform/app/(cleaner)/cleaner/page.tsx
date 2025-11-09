import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const cleanerActions = [
  {
    title: "Grab a New Job",
    description: "Browse open slots in your service area and claim the ones that fit your schedule.",
    href: "/cleaner/jobs"
  },
  {
    title: "Monitor Assigned Houses",
    description: "Follow every home you've claimed and respond quickly if the customer needs to reschedule.",
    href: "/cleaner/pipeline"
  },
  {
    title: "Review My Schedule",
    description: "Check start times, addresses, and access instructions for today and tomorrow.",
    href: "/cleaner/schedule"
  },
  {
    title: "Track Payouts",
    description: "See completed jobs, earnings, and upcoming transfers to your connected accounts.",
    href: "/cleaner/payouts"
  }
];

const CleanerHome = () => (
  <div className="grid gap-6 lg:grid-cols-3">
    <Card className="lg:col-span-3 bg-white">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-accent">Your crew command center</h1>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          This preview outlines the cleaner experience. Soon you&rsquo;ll receive live job offers, communicate with admins, and see payouts in
          real time. Authentication and job routing rules are in progress.
        </p>
        <p>
          Need to view another portal? <Link href="/login" className="text-brand-600">Return to the portal selector</Link> at any time.
        </p>
      </CardContent>
    </Card>

    {cleanerActions.map((item) => (
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

export default CleanerHome;
