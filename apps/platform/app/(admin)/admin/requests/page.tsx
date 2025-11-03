import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const AdminRequestsPage = () => (
  <Card className="bg-white">
    <CardHeader>
      <h1 className="text-2xl font-semibold text-accent">Service Requests</h1>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">
      <p>
        This view will aggregate every incoming request across tenants so admins can approve quotes, adjust pricing, or route work to
        the proper crews. It will include filters for status, county, revenue projections, and margin targets.
      </p>
      <p>Authentication and real data integrations are scheduled for a subsequent milestone.</p>
    </CardContent>
  </Card>
);

export default AdminRequestsPage;
