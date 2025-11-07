import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { getSession } from "@/src/lib/auth/session";
import { getClientPortalData } from "@/src/lib/client-portal";

const ClientVisitsPage = async () => {
  const session = await getSession();
  if (!session) return null;

  const portal = await getClientPortalData(session.email);

  return (
    <Card className="bg-white">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-accent">Upcoming Visits</h1>
        <p className="text-sm text-muted-foreground">Track every scheduled clean, arrival window, and location from one place.</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        {portal.upcomingVisits.length === 0 ? (
          <p>No upcoming services yet. Once HQ locks in your visit, the details will appear here instantly.</p>
        ) : (
          <div className="space-y-3">
            {portal.upcomingVisits.map((visit) => (
              <div key={visit.jobId} className="rounded-3xl border border-brand-100 bg-brand-50/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-brand-600">{visit.service}</p>
                    <p className="text-lg font-semibold text-accent">
                      {visit.dateLabel} • {visit.window}
                    </p>
                  </div>
                  <span className="rounded-full border border-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                    {visit.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{visit.address}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientVisitsPage;
