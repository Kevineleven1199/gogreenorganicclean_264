import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const CleanerJobsPage = () => (
  <Card className="bg-white">
    <CardHeader>
      <h1 className="text-2xl font-semibold text-accent">Job Board</h1>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">
      <p>
        Future releases will include a live feed of open jobs sorted by proximity, payout, and service type. Claiming a job will notify the
        admin team and lock it to your schedule automatically.
      </p>
    </CardContent>
  </Card>
);

export default CleanerJobsPage;
