"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";

const SERVICE_TYPES = [
  "Healthy Home Cleaning",
  "Deep Refresh & Detox",
  "Move-In / Move-Out Detail",
  "Eco Commercial Care",
  "Custom Request"
];

const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5+"];
const BATHROOM_OPTIONS = ["1", "2", "3", "4", "5+"];

export const QuoteForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-brand-100 bg-white p-8 shadow-lg shadow-brand-100/40">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" placeholder="Full Name" aria-label="Full Name" required />
        <Input type="email" name="email" placeholder="Email Address" aria-label="Email Address" required />
        <Input type="tel" name="phone" placeholder="Phone Number" aria-label="Phone Number" required />
        <Input name="address" placeholder="Service Address (optional)" aria-label="Service Address" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm font-semibold text-accent">
          Service Type
          <select
            name="serviceType"
            className="mt-2 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
            aria-label="Service Type"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            {SERVICE_TYPES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm font-semibold text-accent">
          Square Footage
          <Input type="number" name="squareFootage" placeholder="Approx. square footage" aria-label="Square Footage" className="mt-2" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col text-sm font-semibold text-accent">
          Bedrooms
          <select
            name="bedrooms"
            className="mt-2 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
            aria-label="Number of bedrooms"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select
            </option>
            {BEDROOM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm font-semibold text-accent">
          Bathrooms
          <select
            name="bathrooms"
            className="mt-2 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
            aria-label="Number of bathrooms"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select
            </option>
            {BATHROOM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm font-semibold text-accent">
          Preferred Date
          <Input type="date" name="preferredDate" aria-label="Preferred cleaning date" className="mt-2" />
        </label>
      </div>

      <label className="flex flex-col text-sm font-semibold text-accent">
        Notes or special instructions
        <textarea
          name="notes"
          rows={4}
          className="mt-2 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Tell us about your space, priorities, or questions."
        />
      </label>

      <button
        type="submit"
        className="inline-flex w-full min-h-[48px] items-center justify-center rounded-full bg-accent px-8 py-3 text-base font-semibold uppercase tracking-[0.18em] text-white shadow-brand transition hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
      >
        Submit Quote Request
      </button>

      {submitted ? (
        <p className="text-sm font-medium text-accent">
          Thanks for reaching out! A member of our team will contact you within one business day.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          We respond to every quote within one business day. Prefer to call? Reach us at <span className="font-semibold text-accent">(941) 271-7948</span>.
        </p>
      )}
    </form>
  );
};
