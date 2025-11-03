import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const CleanerPayoutsPage = () => (
  <Card className="bg-white">
    <CardHeader>
      <h1 className="text-2xl font-semibold text-accent">Payouts</h1>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">
      <p>
        Earnings summaries, Wise/Zelle/PayPal status, and downloadable statements will live here. Until payouts are wired in, this stays a
        static preview.
      </p>
    </CardContent>
  </Card>
);

export default CleanerPayoutsPage;
