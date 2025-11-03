import Image from "next/image";
import Link from "next/link";

const QUICK_SERVICES = [
  { label: "Basic House Cleaning", icon: "/images/house_24dp_FFFFFF_FILL0_wght300_GRAD0_opsz24.png" },
  { label: "Deep Clean/Spring Clean", icon: "/images/Deep.png" },
  { label: "Move In/Out Clean", icon: "/images/Move.png" },
  { label: "School/Daycare Cleaning", icon: "/images/school.png" }
];

export const QuickServicesRow = () => (
  <section className="bg-brand-800">
    <div className="section-wrapper flex flex-col items-center justify-between gap-6 py-10 text-white md:flex-row">
      {QUICK_SERVICES.map((service) => (
        <Link
          key={service.label}
          href="/get-a-quote"
          className="flex items-center gap-3 rounded-full bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20"
        >
          <Image src={service.icon} alt="" width={32} height={32} className="h-8 w-8" />
          {service.label}
        </Link>
      ))}
    </div>
  </section>
);
