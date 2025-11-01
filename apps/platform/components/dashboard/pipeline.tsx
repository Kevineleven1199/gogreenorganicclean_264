"use client";

const stages = [
  {
    name: "New",
    count: 8,
    description: "Awaiting AI quote or manual touch"
  },
  {
    name: "Quoted",
    count: 14,
    description: "Quote sent to customer"
  },
  {
    name: "Accepted",
    count: 9,
    description: "Locked into scheduling"
  },
  {
    name: "Scheduled",
    count: 12,
    description: "Calendar invites sent"
  }
];

const Pipeline = () => (
  <section className="glass rounded-3xl p-6 text-white">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-display text-2xl">Booking pipeline</h2>
        <p className="text-sm text-white/70">
          Track funnel velocity from first request to completed job.
        </p>
      </div>
      <button className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/20 hover:text-white">
        View automation rules
      </button>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-4">
      {stages.map((stage) => (
        <div
          key={stage.name}
          className="rounded-2xl bg-white/5 p-4 text-sm text-white/70"
        >
          <p className="text-xs uppercase tracking-widest text-white/50">
            {stage.name}
          </p>
          <div className="mt-2 text-2xl font-semibold text-white">
            {stage.count}
          </div>
          <p className="mt-2 text-xs">{stage.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Pipeline;
