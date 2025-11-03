import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const AdminIntegrationsPage = () => (
  <Card className="bg-white">
    <CardHeader>
      <h1 className="text-2xl font-semibold text-accent">Integrations</h1>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">
      <p>
        The integrations console will allow you to connect OpenPhone, Wise/Zelle/PayPal, calendar providers, and HR systems per tenant.
        It will surface connection status, webhook health, and reconciliation insights.
      </p>
      <p>Integration APIs are not wired yet &mdash; this placeholder confirms the portal layout.</p>
    </CardContent>
  </Card>
);

export default AdminIntegrationsPage;
