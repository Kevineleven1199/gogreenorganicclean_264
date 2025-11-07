"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const RegisterPage = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues)
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Unable to register.");
        return;
      }

      router.replace("/client");
      router.refresh();
    });
  };

  return (
    <div className="bg-surface py-20">
      <div className="section-wrapper grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-accent md:text-4xl">Create your client portal</h1>
          <p className="text-base text-muted-foreground">
            Register once and unlock the full Go Green Organic Clean experience: live schedule updates, instant quote approvals, and secure
            payments. Use the same credentials to track every visit for your home or office.
          </p>
          <ul className="space-y-3 rounded-3xl border border-brand-100 bg-white/70 p-6 text-sm text-muted-foreground">
            <li className="font-semibold text-accent">Stay in sync with confirmed cleaners and arrival windows.</li>
            <li className="font-semibold text-accent">Approve add-ons, request reschedules, and message HQ instantly.</li>
            <li className="font-semibold text-accent">Pay invoices by card, ACH, PayPal, or employer allowances.</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-brand-600">
              Sign in here
            </Link>
            .
          </p>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-accent">Tell us about you</h2>
            <p className="text-sm text-muted-foreground">We’ll use this info to personalize your dashboard and communication preferences.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  First name
                  <input
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleChange}
                    className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                    required
                  />
                </label>
                <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  Last name
                  <input
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleChange}
                    className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                    required
                  />
                </label>
              </div>

              <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Email
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                  required
                />
              </label>

              <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Mobile number
                <input
                  name="phone"
                  value={formValues.phone}
                  onChange={handleChange}
                  placeholder="+1 (941) 271-7948"
                  className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                  required
                />
              </label>

              <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Password
                <input
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                  minLength={8}
                  required
                />
              </label>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:opacity-70"
              >
                {pending ? "Creating account..." : "Create account"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
