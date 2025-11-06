'use client';

import { useEffect, useMemo, useState } from "react";
import { Loader2, Mail, Phone, UserPlus, ShieldCheck, Broom } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { cn, formatCurrency } from "@/src/lib/utils";

type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: "HQ" | "CLEANER";
  createdAt: string;
  cleaner: {
    id: string;
    rating: number;
    completedJobs: number;
    serviceRadius: number;
    payoutMethod: string;
  } | null;
};

type UsersResponse = {
  users: AdminUser[];
};

const AdminTeamPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formValues, setFormValues] = useState({
    role: "CLEANER",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    payoutMethod: "WISE",
    serviceRadius: "15"
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to load team.");
      }
      const data = (await response.json()) as UsersResponse;
      setUsers(data.users ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to load team.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formValues.firstName.trim(),
          lastName: formValues.lastName.trim(),
          email: formValues.email.trim(),
          phone: formValues.phone.trim() || undefined,
          role: formValues.role,
          payoutMethod: formValues.payoutMethod,
          serviceRadius: Number(formValues.serviceRadius)
        })
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to add team member.");
      }

      setFormValues({
        role: formValues.role,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        payoutMethod: formValues.payoutMethod,
        serviceRadius: formValues.serviceRadius
      });
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to add team member.");
    } finally {
      setSaving(false);
    }
  };

  const cleaners = useMemo(() => users.filter((user) => user.role === "CLEANER"), [users]);
  const managers = useMemo(() => users.filter((user) => user.role === "HQ"), [users]);

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader className="space-y-3">
          <h1 className="text-2xl font-semibold text-accent">Team Management</h1>
          <p className="text-sm text-muted-foreground">
            Invite new HQ managers or add cleaners to your roster. Crew members automatically receive access to the job board and payout
            dashboard.
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 rounded-3xl border border-brand-100/70 bg-brand-50/40 p-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit}>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Role
              <select
                name="role"
                value={formValues.role}
                onChange={handleChange}
                className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                <option value="CLEANER">Cleaner</option>
                <option value="HQ">HQ Manager</option>
              </select>
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              First name
              <input
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                required
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Last name
              <input
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                required
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Email
              <input
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                required
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Phone
              <input
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                placeholder="+1 (941) 271-7948"
                className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </label>
            {formValues.role === "CLEANER" ? (
              <>
                <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                  Payout method
                  <select
                    name="payoutMethod"
                    value={formValues.payoutMethod}
                    onChange={handleChange}
                    className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                  >
                    <option value="WISE">Wise</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="MANUAL">Manual</option>
                  </select>
                </label>
                <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                  Service radius (miles)
                  <input
                    name="serviceRadius"
                    type="number"
                    min={5}
                    value={formValues.serviceRadius}
                    onChange={handleChange}
                    className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </label>
              </>
            ) : null}
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:opacity-70"
                disabled={saving}
              >
                {saving ? "Adding team member…" : "Add team member"}
              </button>
              <p className="text-xs text-muted-foreground">
                Newly added cleaners can immediately sign in to the cleaner portal using their email once authentication goes live.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <TeamListCard
          title="Cleaners"
          icon={Broom}
          description="Active cleaners with access to the job marketplace and payouts dashboard."
          loading={loading}
          emptyMessage="No cleaners yet. Add your first cleaner above."
          items={cleaners.map((cleaner) => ({
            id: cleaner.id,
            name: `${cleaner.firstName} ${cleaner.lastName}`,
            email: cleaner.email,
            phone: cleaner.phone ?? "—",
            meta: `Radius: ${cleaner.cleaner?.serviceRadius ?? 15} mi • Rating: ${cleaner.cleaner?.rating?.toFixed(1) ?? "5.0"} • Jobs: ${
              cleaner.cleaner?.completedJobs ?? 0
            }`,
            createdAt: new Date(cleaner.createdAt).toLocaleDateString()
          }))}
        />
        <TeamListCard
          title="HQ Managers"
          icon={ShieldCheck}
          description="Admin-level teammates who can edit automations, requests, and integrations."
          loading={loading}
          emptyMessage="No HQ managers yet."
          items={managers.map((manager) => ({
            id: manager.id,
            name: `${manager.firstName} ${manager.lastName}`,
            email: manager.email,
            phone: manager.phone ?? "—",
            meta: `Joined ${new Date(manager.createdAt).toLocaleDateString()}`,
            createdAt: new Date(manager.createdAt).toLocaleDateString()
          }))}
        />
      </div>
    </div>
  );
};

type TeamListProps = {
  title: string;
  description: string;
  loading: boolean;
  emptyMessage: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    meta: string;
    createdAt: string;
  }>;
};

const TeamListCard = ({ title, description, loading, emptyMessage, icon: Icon, items }: TeamListProps) => (
  <Card className="bg-white">
    <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-accent">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-brand-100 px-4 py-12 text-accent">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-white px-4 py-12 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-3xl border border-brand-100 bg-brand-50/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-accent">{item.name}</p>
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{item.createdAt}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {item.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {item.phone}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{item.meta}</p>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default AdminTeamPage;
