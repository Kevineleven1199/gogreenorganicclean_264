import ServiceRequestForm from "@/components/forms/service-request-form";

const RequestPage = () => (
  <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-14 md:px-6">
    <div className="space-y-2 text-white">
      <p className="text-sm uppercase tracking-widest text-brand-200">
        Beautiful booking flow
      </p>
      <h1 className="font-display text-4xl">Book GoGreen in minutes</h1>
      <p className="max-w-2xl text-white/70">
        Answer a couple questions to receive an AI-personalized quote, custom
        availability windows, and match with the perfect crew.
      </p>
    </div>
    <ServiceRequestForm />
  </div>
);

export default RequestPage;
