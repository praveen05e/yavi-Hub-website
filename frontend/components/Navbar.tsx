"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import Magnetic from "@/components/animations/Magnetic";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const lightMode = false;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(23,19,15,0.06)]"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ease-out-expo lg:px-10 ${
            scrolled ? "h-16" : "h-24"
          }`}
        >
          <Link href="/" className={`transition-all duration-300 ${
            lightMode ? "brightness-0 invert" : ""
          }`}>
            <Image src="/logo.png" alt="YAVI Logo" width={100} height={40} className="object-contain" priority />
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-cursor="explore"
                className={`group relative text-sm font-medium transition-colors duration-300 ${
                  lightMode ? "text-ivory/80 hover:text-ivory" : "text-near-black/80 hover:text-near-black"
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-bronze transition-all duration-300 ease-out-expo group-hover:w-full" />
              </Link>
            ))}
            <Magnetic strength={20}>
              <Link
                href="/contact"
                data-cursor="explore"
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors duration-300 ${
                  lightMode ? "bg-ivory text-near-black hover:bg-white" : "bg-charcoal text-ivory hover:bg-near-black"
                }`}
              >
                {siteConfig.primaryCta}
              </Link>
            </Magnetic>
          </nav>

          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className={`flex items-center justify-center p-2 md:hidden transition-colors duration-300 ${
              lightMode ? "text-ivory" : "text-near-black"
            }`}
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen overlay menu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-charcoal text-ivory transition-opacity duration-500 ease-out-expo md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Image src="/logo.png" alt="YAVI Logo" width={90} height={36} className="object-contain brightness-0 invert" priority />
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2">
            <X size={26} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
          {siteConfig.nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-4xl leading-tight transition-transform duration-500 ease-out-expo"
              style={{
                transitionDelay: open ? `${i * 60}ms` : "0ms",
                transform: open ? "translateY(0)" : "translateY(16px)",
                opacity: open ? 1 : 0,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-10">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block rounded-full bg-ivory px-6 py-3 text-center text-sm font-medium text-near-black"
          >
            {siteConfig.primaryCta}
          </Link>
        </div>
      </div>
    </>
  );
}
