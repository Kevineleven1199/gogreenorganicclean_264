"use client";

const metrics = [
  {
    label: "MRR",
    value: "$82,450",
    delta: "+18% MoM",
    tone: "positive"
  },
  {
    label: "Avg. quote turnaround",
    value: "11m",
    delta: "-6m faster",
    tone: "positive"
  },
  {
    label: "Crew utilization",
    value: "86%",
    delta: "+5% vs target",
    tone: "positive"
  },
  {
    label: "NPS",
    value: "72",
    delta: "Hold steady",
    tone: "neutral"
  }
];

const MetricCards = () => (
  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {metrics.map((metric) => (
      <article
        key={metric.label}
        className="glass rounded-3xl p-6 text-white transition hover:-translate-y-1"
      >
        <p className="text-sm uppercase tracking-widest text-white/60">
          {metric.label}
        </p>
        <div className="mt-3 text-3xl font-bold">{metric.value}</div>
        <p
          className={`mt-2 text-sm ${
            metric.tone === "positive"
              ? "text-emerald-300"
              : metric.tone === "negative"
                ? "text-rose-300"
                : "text-white/70"
          }`}
        >
          {metric.delta}
        </p>
      </article>
    ))}
  </section>
);

export default MetricCards;
