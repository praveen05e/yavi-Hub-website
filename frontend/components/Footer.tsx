import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { Instagram, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ivory text-near-black">
      <div className="mx-auto max-w-7xl border-t border-near-black/10 px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left: Logo & Quote */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image src="/logo.png" alt="YAVI Logo" width={80} height={80} className="object-contain" />
            </Link>
            <p className="mt-6 text-lg font-display italic text-near-black/80">
              "{siteConfig.tagline}"
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-near-black/60">
              {siteConfig.heroSupportingText}
            </p>
            <div className="mt-8 flex gap-6 text-sm font-medium">
              {siteConfig.contact.instagram && (
                <a href={siteConfig.contact.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bronze" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              )}
              {siteConfig.contact.facebook && (
                <a href={siteConfig.contact.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bronze" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              )}
              {siteConfig.contact.linkedin && (
                <a href={siteConfig.contact.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bronze" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Middle: Contact Info & Links */}
          <div className="lg:col-span-3 lg:col-start-6 flex flex-col">
            <div className="eyebrow mb-6 text-near-black/40">Get in touch</div>
            <ul className="space-y-4 text-sm text-near-black/80">
              {siteConfig.contact.email && (
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="font-medium transition-colors hover:text-bronze">
                    {siteConfig.contact.email}
                  </a>
                </li>
              )}
              {siteConfig.contact.phone && (
                <li>
                  <a href={`tel:${siteConfig.contact.phone}`} className="font-medium transition-colors hover:text-bronze">
                    {siteConfig.contact.phone}
                  </a>
                </li>
              )}
              <li className="pt-2 leading-relaxed max-w-[200px]">
                {siteConfig.contact.address || "123 Design Avenue, Creative District, City, 100001"}
              </li>
            </ul>

          </div>

          {/* Right: Google Map Visual */}
          <div className="lg:col-span-4 overflow-hidden rounded-2xl border border-near-black/10 bg-cream">
            <iframe
              title="YAVI Studio Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0964437281295!2d80.1418249!3d12.901519699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525fc91ab42edf%3A0xfb836b3b46f7171!2sYaVi%20Interior%20Hub!5e0!3m2!1sen!2sin!4v1787290616389!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "250px" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full grayscale contrast-125 opacity-90 transition-opacity hover:opacity-100"
            />
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-near-black/10 pt-8 text-xs text-near-black/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {siteConfig.name} Studio. All rights reserved.</span>
          <span className="mt-2 sm:mt-0">
            Designed by <a href="https://ztoitech.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 font-medium hover:underline">ztoi Tech</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
