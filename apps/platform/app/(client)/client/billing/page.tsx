import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const ClientBillingPage = () => (
  <Card className="bg-white">
    <CardHeader>
      <h1 className="text-2xl font-semibold text-accent">Billing & Payments</h1>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">
      <p>
        Future functionality will allow customers to update payment methods, review ledger history, download receipts, and manage autopay
        preferences. Today this is a static preview placeholder.
      </p>
    </CardContent>
  </Card>
);

export default ClientBillingPage;
