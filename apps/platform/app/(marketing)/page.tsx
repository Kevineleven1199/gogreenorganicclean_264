import MainNav from "@/components/navigation/main-nav";
import Hero from "@/components/marketing/hero";
import FeatureGrid from "@/components/marketing/feature-grid";
import CTA from "@/components/marketing/cta";

const MarketingPage = () => (
  <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-4 pb-20 pt-8 md:px-6">
    <MainNav />
    <main className="flex flex-col gap-16">
      <Hero />
      <FeatureGrid />
      <section
        id="pricing"
        className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-white md:grid-cols-2"
      >
        <div>
          <h2 className="font-display text-3xl">Launch plan</h2>
          <p className="mt-2 text-white/70">
            Bring your existing GoGreen brand over with concierge onboarding and
            re-use of legacy WordPress articles as a knowledge center.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white/10 p-6">
            <div className="text-sm uppercase tracking-widest text-brand-200">
              HQ license
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold">$299</span>
              <span className="text-sm text-white/70">per location / month</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>Unlimited customers & jobs</li>
              <li>AI-powered quoting & automations</li>
              <li>Calendar sync + automated notifications</li>
              <li>Integrated payouts (Wise, Zelle, PayPal, ADP 1099)</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 p-6">
            <div className="text-sm uppercase tracking-widest text-brand-200">
              Reseller program
            </div>
            <p className="mt-2 text-sm text-white/80">
              Spin up tenants for partner service brands with branded domains
              and recurring revenue sharing.
            </p>
          </div>
        </div>
      </section>
      <CTA />
    </main>
    <footer className="flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
      <p>© {new Date().getFullYear()} GoGreen Organic Clean. All rights reserved.</p>
      <div className="flex flex-wrap gap-4">
        <a href="https://gogreenorganicclean.com" className="hover:text-white">
          Legacy site (read only)
        </a>
        <a href="/status" className="hover:text-white">
          Status
        </a>
        <a href="/legal" className="hover:text-white">
          Legal
        </a>
      </div>
    </footer>
  </div>
);

export default MarketingPage;
