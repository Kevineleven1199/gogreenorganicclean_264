import DashboardTopBar from "@/components/dashboard/top-bar";
import MetricCards from "@/components/dashboard/metric-cards";
import Pipeline from "@/components/dashboard/pipeline";
import Schedule from "@/components/dashboard/schedule";
import { resolveTenantParams, type TenantPageProps } from "@/src/lib/tenant";

type DashboardPageProps = TenantPageProps;

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const { tenantSlug } = await resolveTenantParams(params);
  const tenantName = tenantSlug === "gogreen" ? "GoGreen Organic Clean" : tenantSlug.replace(/-/g, " ");

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
