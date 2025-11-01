"use client";

const clients = [
  {
    name: "The Harlow Residences",
    value: "$4,820 / mo",
    services: "Common area clean, pressure wash",
    health: "Healthy"
  },
  {
    name: "Westside CoWork",
    value: "$3,125 / mo",
    services: "Nightly clean, plant care",
    health: "Watch"
  },
  {
    name: "Cassidy Family",
    value: "$620 / mo",
    services: "Bi-weekly eco clean",
    health: "Healthy"
  },
  {
    name: "Scoot Fleet",
    value: "$980 / mo",
    services: "Fleet detail, ozone",
    health: "Growing"
  }
];

const healthBadge: Record<string, string> = {
  Healthy: "bg-emerald-500/20 text-emerald-200",
  Watch: "bg-amber-500/20 text-amber-200",
  Growing: "bg-sky-500/20 text-sky-200"
};

const ClientTable = () => (
  <section className="glass rounded-3xl p-6 text-white">
    <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="font-display text-2xl">Client portfolio</h2>
        <p className="text-sm text-white/70">
          Segment accounts, monitor satisfaction, and trigger nurture automations.
        </p>
      </div>
      <button className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white hover:text-white">
        Export to CSV
      </button>
    </header>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {clients.map((client) => (
        <article
          key={client.name}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 transition hover:border-brand-200 hover:text-white"
        >
          <h3 className="font-semibold text-white">{client.name}</h3>
          <p className="mt-2 text-lg font-semibold text-brand-100">
            {client.value}
          </p>
          <p className="mt-2">{client.services}</p>
          <span
            className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${healthBadge[client.health]}`}
          >
            {client.health}
          </span>
        </article>
      ))}
    </div>
  </section>
);

export default ClientTable;
