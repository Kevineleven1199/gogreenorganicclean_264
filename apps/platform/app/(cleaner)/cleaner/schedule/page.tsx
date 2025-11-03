import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const CleanerSchedulePage = () => (
  <Card className="bg-white">
    <CardHeader>
      <h1 className="text-2xl font-semibold text-accent">Schedule</h1>
    </CardHeader>
    <CardContent className="space-y-4 text-sm text-muted-foreground">
      <p>
        Cleaners will view routes, start times, and entry instructions here. The final experience will sync with calendar providers and push
        reminders before each visit.
      </p>
    </CardContent>
  </Card>
);

export default CleanerSchedulePage;
