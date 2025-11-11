"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/src/lib/animations";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const OPTIONS = [
  {
    title: "Customer Portal",
    description: "View upcoming visits, approve quotes, and manage billing.",
    href: "/client"
  },
  {
    title: "Cleaner Portal",
    description: "Claim jobs, review schedules, and track payouts on the go.",
    href: "/cleaner"
  },
  {
    title: "Admin Portal",
    description: "Monitor service requests, configure automations, and manage tenants.",
    href: "/admin"
  }
];

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [portal, setPortal] = useState<"client" | "cleaner" | "admin">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, startTransition] = useTransition();

  const redirect = searchParams.get("redirect");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, portal })
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Unable to log in.");
        return;
      }

      const data = (await response.json()) as { redirectTo?: string };
      router.replace(redirect ?? data.redirectTo ?? "/");
      router.refresh();
    });
  };

  return (
    <div className="bg-surface py-20">
      <div className="section-wrapper grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
          <motion.div variants={fadeUp}>
            <h1 className="text-3xl font-semibold text-accent md:text-4xl">Sign in to your GoGreen portal</h1>
            <p className="mt-4 text-base text-muted-foreground">
              Use the credentials you created during registration. Admins can use the master access provided by HQ to manage cleaners and
              automations.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid gap-6 md:grid-cols-2">
            {OPTIONS.map((option) => (
              <Card key={option.title} className="bg-white text-left">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-accent">{option.title}</h2>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>{option.description}</p>
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-500">Available after login</span>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>

        <Card className="bg-white">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-accent">Secure login</h2>
            <p className="text-sm text-muted-foreground">Select a portal, enter your email, and use your password to continue.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Portal
                <select
                  value={portal}
                  onChange={(event) => setPortal(event.target.value as typeof portal)}
                  className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                >
                  <option value="client">Customer</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
                  required
                />
              </label>

              <label className="flex flex-col text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Password
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-brand-100 bg-white px-3 py-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-brand-200">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="flex-1 border-none bg-transparent text-sm text-foreground focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-brand-500 transition hover:text-brand-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:opacity-70"
              >
                {pending ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link href="/register" className="font-semibold text-brand-600">
                Create your client account
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
