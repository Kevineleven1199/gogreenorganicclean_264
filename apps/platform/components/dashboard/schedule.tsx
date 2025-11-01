"use client";

const slots = [
  { label: "Mon", utilization: 0.72 },
  { label: "Tue", utilization: 0.81 },
  { label: "Wed", utilization: 0.65 },
  { label: "Thu", utilization: 0.93 },
  { label: "Fri", utilization: 0.88 },
  { label: "Sat", utilization: 0.54 },
  { label: "Sun", utilization: 0.32 }
];

const Schedule = () => (
  <section className="glass rounded-3xl p-6 text-white">
    <div className="flex items-center justify-between">
      <h2 className="font-display text-2xl text-white">
        Crew utilization out-look
      </h2>
      <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white hover:text-white">
        Sync calendars
      </button>
    </div>
    <div className="mt-6 grid grid-cols-7 gap-4">
      {slots.map((slot) => (
        <div
          key={slot.label}
          className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"
        >
          <span>{slot.label}</span>
          <div className="relative h-24 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute bottom-0 left-0 right-0 rounded-full bg-brand-400"
              style={{ height: `${slot.utilization * 100}%` }}
            />
          </div>
          <span className="font-semibold text-white">
            {Math.round(slot.utilization * 100)}%
          </span>
        </div>
      ))}
    </div>
  </section>
);

export default Schedule;
