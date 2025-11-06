'use client';

import { useEffect, useState } from "react";
import { Loader2, MapPin, Sparkles, CalendarClock, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

type SchedulingOption = {
  windowStart: string;
  windowEnd: string;
  priority: number;
};

type OpenJob = {
  id: string;
  requestId: string;
  quoteId?: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  address: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
  };
  serviceType: string;
  squareFootage: number | null;
  notes?: string | null;
  payoutAmount?: number | null;
  quoteTotal?: number | null;
  status: string;
  createdAt: string;
  schedulingOptions?: SchedulingOption[];
};

type ClaimFeedback = {
  jobId: string;
  status: "success" | "error";
  message: string;
};

const defaultScheduleSlots = [
  { date: "", start: "", end: "" },
  { date: "", start: "", end: "" },
  { date: "", start: "", end: "" }
] as const;

const CleanerJobsPage = () => {
  const [jobs, setJobs] = useState<OpenJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cleanerId, setCleanerId] = useState<string>("");
  const [cleanerPhone, setCleanerPhone] = useState<string>("");
  const [feedback, setFeedback] = useState<ClaimFeedback | null>(null);
  const [claimingJobId, setClaimingJobId] = useState<string | null>(null);
  const [scheduleSlots, setScheduleSlots] = useState(defaultScheduleSlots.map((slot) => ({ ...slot })));
  const [scheduleStatus, setScheduleStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [claimedJob, setClaimedJob] = useState<OpenJob | null>(null);

  useEffect(() => {
    const storedCleanerId = window.localStorage.getItem("gogreen-cleaner-id");
    const storedCleanerPhone = window.localStorage.getItem("gogreen-cleaner-phone");
    if (storedCleanerId) setCleanerId(storedCleanerId);
    if (storedCleanerPhone) setCleanerPhone(storedCleanerPhone);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/jobs/open", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load jobs. Pull to refresh.");
        }
        const data = (await response.json()) as { jobs: OpenJob[] };
        setJobs(data.jobs ?? []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unable to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    const interval = window.setInterval(fetchJobs, 45_000);
    return () => window.clearInterval(interval);
  }, []);

  const persistCleanerContext = (id: string, phone: string) => {
    window.localStorage.setItem("gogreen-cleaner-id", id);
    window.localStorage.setItem("gogreen-cleaner-phone", phone);
  };

  const handleCleanerInfoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cleanerId || !cleanerPhone) return;
    persistCleanerContext(cleanerId, cleanerPhone);
    setFeedback({ jobId: "", status: "success", message: "Saved! You’re ready to claim jobs." });
  };

  const handleClaim = async (job: OpenJob) => {
    if (!cleanerId || !cleanerPhone) {
      setFeedback({ jobId: job.id, status: "error", message: "Add your cleaner ID and phone before claiming." });
      return;
    }

    try {
      setClaimingJobId(job.id);
      setFeedback(null);
      const response = await fetch("/api/jobs/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jobId: job.id,
          cleanerId,
          cleanerPhone,
          cleanerName: cleanerId
        })
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to claim job.");
      }

      setFeedback({ jobId: job.id, status: "success", message: "Job claimed! Dispatch will confirm shortly." });
      setClaimedJob(job);
      setScheduleStatus("idle");
      setScheduleSlots(defaultScheduleSlots.map((slot) => ({ ...slot })));
      setJobs((prev) => prev.filter((item) => item.id !== job.id));
    } catch (err) {
      console.error(err);
      setFeedback({ jobId: job.id, status: "error", message: err instanceof Error ? err.message : "Unable to claim job." });
    } finally {
      setClaimingJobId(null);
    }
  };

  const updateScheduleSlot = (index: number, field: "date" | "start" | "end", value: string) => {
    setScheduleSlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const submitScheduleSlots = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!claimedJob?.quoteId) return;

    const preparedSlots = scheduleSlots
      .filter((slot) => slot.date && slot.start && slot.end)
      .map((slot, index) => ({
        start: new Date(`${slot.date}T${slot.start}`).toISOString(),
        end: new Date(`${slot.date}T${slot.end}`).toISOString(),
        priority: index + 1
      }));

    if (!preparedSlots.length) {
      setScheduleStatus("error");
      setError("Please provide at least one preferred time window.");
      return;
    }

    setScheduleStatus("saving");
    try {
      const response = await fetch("/api/scheduling/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quoteId: claimedJob.quoteId,
          slots: preparedSlots
        })
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to save availability.");
      }

      setScheduleStatus("saved");
    } catch (err) {
      console.error(err);
      setScheduleStatus("error");
      setError(err instanceof Error ? err.message : "Unable to save availability.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader className="space-y-3">
          <h1 className="text-2xl font-semibold text-accent">Available Jobs</h1>
          <p className="text-sm text-muted-foreground">
            Claiming a job alerts HQ instantly. Once confirmed, you’ll receive a calendar invite and prep checklist automatically.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-3 rounded-2xl border border-brand-100/70 bg-brand-50/40 p-4 sm:grid-cols-2" onSubmit={handleCleanerInfoSubmit}>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Cleaner ID
              <input
                className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                value={cleanerId}
                onChange={(event) => setCleanerId(event.target.value)}
                placeholder="e.g. CLN-204"
                required
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Mobile number for updates
              <input
                className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                value={cleanerPhone}
                onChange={(event) => setCleanerPhone(event.target.value)}
                placeholder="+1 (941) 555-0123"
                required
              />
            </label>
            <button
              type="submit"
              className="sm:col-span-2 inline-flex min-h-[42px] items-center justify-center rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
            >
              Save profile for this device
            </button>
          </form>

          {feedback && !feedback.jobId ? (
            <div className={cn("rounded-2xl px-4 py-3 text-sm", feedback.status === "success" ? "bg-brand-50 text-accent" : "bg-red-50 text-red-700")}>
              {feedback.message}
            </div>
          ) : null}

          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-brand-100 px-4 py-12 text-accent">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading nearby jobs…</span>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-brand-100 bg-white px-4 py-12 text-center text-sm text-muted-foreground">
              All cleanings are currently assigned. Check back soon or enable notifications in the Go Green app.
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const payout = job.payoutAmount ? `$${job.payoutAmount.toFixed(2)}` : "TBD";
                const quoteTotal = job.quoteTotal ? `$${job.quoteTotal.toFixed(2)}` : "—";
                const options = (job.schedulingOptions ?? []).slice().sort((a, b) => a.priority - b.priority);

                return (
                  <div key={job.id} className="space-y-3 rounded-3xl border border-brand-100 bg-white p-5 shadow-sm shadow-brand-100/60">
                    <header className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent/70">{job.id}</p>
                        <h2 className="text-lg font-semibold text-accent">{job.customer.name}</h2>
                      </div>
                      <div className="text-right text-sm text-accent">
                        <p className="font-semibold">Cleaner payout: {payout}</p>
                        <p className="text-xs text-muted-foreground">Customer pays ~ {quoteTotal}</p>
                      </div>
                    </header>

                    <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-sunshine" />
                        <div>
                          <p>{job.address.line1}</p>
                          <p>{[job.address.line2, job.address.city, job.address.state].filter(Boolean).join(", ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-sunshine" />
                        <span>Surface area: {job.squareFootage ? `${job.squareFootage.toLocaleString()} sq ft` : "Tell us on arrival"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-sunshine" />
                        <span>{job.serviceType.replace("_", " ")}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CalendarClock className="mt-0.5 h-4 w-4 text-sunshine" />
                        <div>
                          {options.length ? (
                            options.map((option) => (
                              <p key={`${job.id}-${option.priority}`}>
                                {new Date(option.windowStart).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} –{" "}
                                {new Date(option.windowEnd).toLocaleTimeString([], { timeStyle: "short" })}
                              </p>
                            ))
                          ) : (
                            <p>Customer will confirm after claim.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {job.notes ? (
                      <div className="rounded-2xl bg-brand-50/60 px-4 py-3 text-sm text-accent">
                        <p className="font-semibold">Customer notes</p>
                        <p className="text-sm text-muted-foreground">{job.notes}</p>
                      </div>
                    ) : null}

                    <footer className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => handleClaim(job)}
                        disabled={claimingJobId === job.id}
                      >
                        {claimingJobId === job.id ? "Claiming…" : "Claim this job"}
                      </button>
                      <a
                        href={`tel:${job.customer.phone}`}
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-accent bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent transition hover:bg-brand-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
                      >
                        Call client
                      </a>
                    </footer>

                    {feedback && feedback.jobId === job.id ? (
                      <p className={cn("text-sm", feedback.status === "success" ? "text-accent" : "text-red-600")}>{feedback.message}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {claimedJob?.quoteId ? (
        <Card className="bg-white">
          <CardHeader>
            <h2 className="text-xl font-semibold text-accent">Share your availability windows</h2>
            <p className="text-sm text-muted-foreground">
              {claimedJob.customer.name} • {claimedJob.address.city}, {claimedJob.address.state} — cleaner payout approx.
              {claimedJob.payoutAmount ? ` $${claimedJob.payoutAmount.toFixed(2)}` : " TBD"}
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={submitScheduleSlots}>
              {scheduleSlots.map((slot, index) => (
                <div key={`slot-${index}`} className="grid gap-3 rounded-2xl border border-brand-100/80 bg-brand-50/40 p-3 sm:grid-cols-3">
                  <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Date
                    <input
                      type="date"
                      className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                      value={slot.date}
                      onChange={(event) => updateScheduleSlot(index, "date", event.target.value)}
                    />
                  </label>
                  <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Start
                    <input
                      type="time"
                      className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                      value={slot.start}
                      onChange={(event) => updateScheduleSlot(index, "start", event.target.value)}
                    />
                  </label>
                  <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    End
                    <input
                      type="time"
                      className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                      value={slot.end}
                      onChange={(event) => updateScheduleSlot(index, "end", event.target.value)}
                    />
                  </label>
                </div>
              ))}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:opacity-70"
                  disabled={scheduleStatus === "saving"}
                >
                  {scheduleStatus === "saving" ? "Saving availability…" : "Save preferred windows"}
                </button>
              </div>
              {scheduleStatus === "saved" ? (
                <p className="text-sm font-semibold text-accent">Availability received! HQ will match you with the best slot.</p>
              ) : null}
              {scheduleStatus === "error" ? (
                <p className="text-sm font-semibold text-red-600">We couldn’t save availability. Try again or text HQ.</p>
              ) : null}
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default CleanerJobsPage;
