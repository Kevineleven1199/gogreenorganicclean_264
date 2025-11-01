import DashboardTopBar from "@/components/dashboard/top-bar";
import MetricCards from "@/components/dashboard/metric-cards";
import Pipeline from "@/components/dashboard/pipeline";
import Schedule from "@/components/dashboard/schedule";

type DashboardPageProps = {
  params: {
    tenantSlug: string;
  };
};

const DashboardPage = ({ params }: DashboardPageProps) => {
  const tenantName =
    params.tenantSlug === "gogreen"
      ? "GoGreen Organic Clean"
      : params.tenantSlug.replace(/-/g, " ");

  return (
    <div className="space-y-6">
      <DashboardTopBar tenantName={tenantName} />
      <MetricCards />
      <Pipeline />
      <Schedule />
    </div>
  );
};

export default DashboardPage;
