import Link from "next/link";
import { Facebook, Instagram, Phone, Clock, MapPin, Newspaper } from "lucide-react";
import Image from "next/image";
import { CallbackForm } from "@/src/components/CallbackForm";

const QUICK_LINKS = [
  { label: "Who We Are", href: "#who-we-are" },
  { label: "Our Residential Services", href: "#services" },
  { label: "Our Commercial Services", href: "#services" },
  { label: "Get A Free Quote", href: "/get-a-quote" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms & Conditions", href: "#terms" }
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://www.facebook.com/gogreenorganicclean", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/gogreenorganicclean/", label: "Instagram" },
  { icon: Newspaper, href: "https://x.com/ggorganicclean", label: "X" },
  { icon: MapPin, href: "https://maps.app.goo.gl/4FBEesLcS8c3Djc87", label: "Google" }
];

export const Footer = () => (
  <footer className="bg-accent text-white" id="contact">
    <div className="section-wrapper grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-6">
        <Image
          src="/images/cropped-Mobile-Logo-164x76.png"
          width={150}
          height={70}
          alt="Go Green Organic Clean"
          className="h-12 w-auto"
        />
        <p className="text-sm text-white/80">
          Organic, allergen-free cleaning tailored for your family’s comfort. Serving Sarasota and surrounding counties with eco-conscious excellence.
        </p>
        <div className="grid gap-3 text-sm text-white/80">
          <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> (941) 271–7948</span>
          <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Mon–Fri: 8:00 AM – 4:00 PM · Sat–Sun: Closed</span>
        </div>
        <div className="flex gap-3">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <Link key={label} href={href} className="rounded-full bg-white/10 p-2 transition hover:bg-white/25" aria-label={label}>
              <Icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Quick Links</h4>
        <ul className="grid gap-3 text-sm text-white/80">
          {QUICK_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="transition hover:text-brand-100">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Request A Callback</h4>
        <CallbackForm />
      </div>
    </div>

    <div className="border-t border-white/10 bg-accent/95">
      <div className="section-wrapper flex flex-col items-center justify-between gap-4 py-6 text-center text-xs text-white/70 sm:flex-row sm:text-left">
        <p>Copyright © 2025 Go Green Organic Clean | Powered by Go Green Organic Clean</p>
        <button className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-white">
          <Image src="/images/en_US.png" alt="English" width={20} height={14} />
          English
        </button>
      </div>
    </div>
  </footer>
);
