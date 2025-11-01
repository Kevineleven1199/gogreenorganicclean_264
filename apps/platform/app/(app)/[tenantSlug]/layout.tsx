import { ReactNode } from "react";
import DashboardNav from "@/components/dashboard/nav";

type TenantLayoutProps = {
  children: ReactNode;
  params: {
    tenantSlug: string;
  };
};

const TenantLayout = ({ children, params }: TenantLayoutProps) => {
  const { tenantSlug } = params;

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-8 lg:px-6">
      <DashboardNav tenantSlug={tenantSlug} />
      <main className="flex-1 space-y-6 text-white">{children}</main>
    </div>
  );
};

export default TenantLayout;
