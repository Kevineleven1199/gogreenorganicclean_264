import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const ClientQuotesPage = () => (
  <Card className="bg-white">
    <CardHeader>
      <h1 className="text-2xl font-semibold text-accent">Quotes</h1>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">
      <p>
        Customers will review new proposals, compare packages, and approve or request adjustments here. The final build will support one-click
        approvals, suggested availability windows, and instant chat with the admin team.
      </p>
    </CardContent>
  </Card>
);

export default ClientQuotesPage;
