import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const ClientVisitsPage = () => (
  <Card className="bg-white">
    <CardHeader>
      <h1 className="text-2xl font-semibold text-accent">Upcoming Visits</h1>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">
      <p>
        This module will display scheduled services, the assigned crew, checklists, and arrival windows. Customers will be able to reschedule,
        leave entry instructions, and request add-ons from this screen.
      </p>
    </CardContent>
  </Card>
);

export default ClientVisitsPage;
