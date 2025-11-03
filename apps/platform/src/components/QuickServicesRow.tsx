import Image from "next/image";
import Link from "next/link";

const QUICK_SERVICES = [
  {
    label: "Basic House Cleaning",
    description: "We provide efficient eco-cleaning.",
    icon: "/images/house_24dp_FFFFFF_FILL0_wght300_GRAD0_opsz24.png",
    href: "https://gogreenorganicclean.com/services/basic-house-cleaning/"
  },
  {
    label: "Deep Clean/Spring Clean",
    description: "Thorough, seasonal home refresh.",
    icon: "/images/Deep.png",
    href: "https://gogreenorganicclean.com/services/deep-clean-spring-clean/"
  },
  {
    label: "Move In/Out Clean",
    description: "We perfect move-in/out cleans.",
    icon: "/images/Move.png",
    href: "https://gogreenorganicclean.com/services/move-in-out-clean/"
  },
  {
    label: "School/Daycare Cleaning",
    description: "All surfaces eco-cleaned.",
    icon: "/images/school.png",
    href: "https://gogreenorganicclean.com/services/school-daycare-cleaning/"
  }
];

export const QuickServicesRow = () => (
  <section className="bg-brand-800" id="quick-services">
    <div className="section-wrapper grid gap-6 py-10 text-white sm:grid-cols-2 lg:grid-cols-4">
      {QUICK_SERVICES.map((service) => (
        <Link
          key={service.label}
          href={service.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center rounded-3xl bg-white/10 px-6 py-5 text-center transition hover:bg-white/20"
        >
          <Image src={service.icon} alt="" width={56} height={56} className="h-14 w-14" />
          <span className="mt-4 text-sm font-semibold uppercase tracking-[0.25em]">{service.label}</span>
          <span className="mt-3 text-xs text-white/80">{service.description}</span>
        </Link>
      ))}
    </div>
  </section>
);
