import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const AdminAutomationsPage = () => (
  <Card className="bg-white">
    <CardHeader>
      <h1 className="text-2xl font-semibold text-accent">Automations</h1>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">
      <p>
        This space will host the drag-and-drop automation builder, where you can define quote approvals, job routing, payout splits, and
        notification cadences per tenant. Expect reusable templates and version history in a future release.
      </p>
      <p>For now, consider this a preview of the upcoming workflow designer.</p>
    </CardContent>
  </Card>
);

export default AdminAutomationsPage;
