"use client";

const jobs = [
  {
    id: "JOB-2041",
    type: "Eco home clean",
    payout: "$178",
    duration: "3h",
    location: "Decatur, GA",
    start: "Tomorrow • 9:00 AM",
    claimWindow: "2m remaining"
  },
  {
    id: "JOB-2040",
    type: "Driveway pressure wash",
    payout: "$245",
    duration: "4h",
    location: "Atlanta, GA",
    start: "Thu • 1:00 PM",
    claimWindow: "7m remaining"
  },
  {
    id: "JOB-2039",
    type: "Fleet detail (2 vehicles)",
    payout: "$320",
    duration: "5h",
    location: "Marietta, GA",
    start: "Fri • 8:00 AM",
    claimWindow: "11m remaining"
  }
];

const MarketplaceBoard = () => (
  <section className="glass rounded-3xl p-6 text-white">
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="font-display text-2xl">Crew marketplace</h2>
        <p className="text-sm text-white/70">
          Jobs appear here after customer approval. Cleans run on a 65/35 split.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-white/60">
        <span className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-200">
          23 crews online
        </span>
        <span className="inline-flex items-center rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1 text-sky-200">
          Smart routing enabled
        </span>
      </div>
    </header>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <article
          key={job.id}
          className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80 transition hover:border-brand-200 hover:text-white"
        >
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-white/50">
              {job.id}
            </p>
            <h3 className="font-display text-2xl text-white">{job.type}</h3>
            <p>{job.location}</p>
            <p className="text-white/60">{job.start}</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                {job.duration}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                {job.claimWindow}
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-xl font-semibold text-white">{job.payout}</div>
            <button className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-brand transition hover:bg-brand-400">
              Claim job
            </button>
          </div>
        </article>
      ))}
      <article className="rounded-3xl border border-dashed border-white/20 p-6 text-center text-sm text-white/60 transition hover:border-brand-200 hover:text-white">
        <p className="font-semibold text-white">
          Set availability &amp; automations
        </p>
        <p className="mt-2">
          Sync Google Calendar, define travel radius, and auto-claim your ideal
          jobs with priority rules.
        </p>
        <button className="mt-4 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 hover:border-white hover:text-white">
          Configure smart grabs
        </button>
      </article>
    </div>
  </section>
);

export default MarketplaceBoard;
