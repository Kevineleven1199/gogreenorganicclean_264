import MarketplaceBoard from "@/components/marketplace/board";
import { resolveTenantParams, type TenantPageProps } from "@/src/lib/tenant";

const MarketplacePage = async ({ params }: TenantPageProps) => {
  const { tenantSlug } = await resolveTenantParams(params);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        <h1 className="font-display text-3xl">Cleaner marketplace</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Jobs are released to pre-vetted crews and auto-claimed based on rating, travel time, and specialization. Every payout automatically
          splits 65% to your cleaner via Wise, Zelle, or PayPal with 1099 tracking.
        </p>
        <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/20 px-4 py-2 text-xs text-white/60">
          <span className="font-semibold text-white/80">Tenant</span>{" "}
          {tenantSlug}
          <span className="h-1 w-1 rounded-full bg-white/20" />
          Smart dispatch &bull; Priority radius 12mi
        </div>
      </header>
      <MarketplaceBoard />
    </div>
  );
};

export default MarketplacePage;
