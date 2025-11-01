import RequestTable from "@/components/dashboard/request-table";

type RequestsPageProps = {
  params: {
    tenantSlug: string;
  };
};

const RequestsPage = ({ params }: RequestsPageProps) => (
  <div className="space-y-6">
    <header className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <h1 className="font-display text-3xl">Quote queue</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/70">
        Every incoming lead flows here first. Your AI quote engine evaluates
        size, surfaces, travel time, and margin targets before sending polished
        proposals out via OpenPhone SMS.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/60">
        <span className="rounded-full border border-white/20 px-3 py-1">
          Tenant: {params.tenantSlug}
        </span>
        <span className="rounded-full border border-white/20 px-3 py-1">
          Automation: Hybrid AI + manual review
        </span>
      </div>
    </header>
    <RequestTable />
  </div>
);

export default RequestsPage;
