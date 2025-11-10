import ClientTable from "@/components/clients/table";
import { resolveTenantParams, type TenantPageProps } from "@/src/lib/tenant";

type ClientsPageProps = TenantPageProps;

const ClientsPage = async ({ params }: ClientsPageProps) => {
  const { tenantSlug } = await resolveTenantParams(params);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h1 className="font-display text-3xl">Clients & memberships</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Manage recurring plans, loyalty tiers, referrals, and neighborhood cohorts. Use this to build packaged offerings when
          reselling GoGreenOS to partner service brands.
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Tenant • {tenantSlug}</p>
      </header>
      <ClientTable />
    </div>
  );
};

export default ClientsPage;
