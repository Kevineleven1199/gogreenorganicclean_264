import ServiceRequestForm from "@/components/forms/service-request-form";

const GetAQuotePage = () => (
  <div className="bg-surface py-20">
    <div className="section-wrapper flex flex-col gap-8">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold text-accent">Request a Free Quote</h1>
        <p className="mt-4 text-muted-foreground">
          Share a few details about your space and preferred schedule. Our eco-friendly cleaning experts will respond with a personalized
          proposal and availability.
        </p>
      </div>
      <ServiceRequestForm />
    </div>
  </div>
);

export default GetAQuotePage;
