"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import TextReveal from "@/components/animations/TextReveal";
import { siteConfig } from "@/data/siteConfig";

const INDIAN_PHONE_RE = /^(\+91[-\s]?)?[6-9]\d{9}$/;

type FormState = {
  name: string;
  phone: string;
  email: string;
  location: string;
  property_type: string;
  project_type: string;
  budget: string;
  requirements: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  location: "",
  property_type: "",
  project_type: "",
  budget: "",
  requirements: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    else if (!INDIAN_PHONE_RE.test(form.phone.replace(/\s/g, ""))) next.phone = "Enter a valid Indian phone number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.requirements.trim() && !form.project_type.trim())
      next.requirements = "Tell us a little about your project.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      await api.createLead({ ...form, source: "Contact Form" });
      setStatus("sent");
      setForm(initialState);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-40 lg:px-10 lg:pt-48">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left Column: Text & Info */}
        <div className="flex flex-col justify-between">
          <div>
            <TextReveal className="eyebrow text-bronze">Contact</TextReveal>
            <TextReveal delay={0.1} as="h1" className="mt-5 font-display text-4xl text-near-black sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Let&rsquo;s talk about your space.
            </TextReveal>
            <TextReveal delay={0.2} as="p" className="mt-6 max-w-md text-lg text-near-black/70 leading-relaxed">
              Whether you are looking to completely renovate a villa or furnish a new apartment, we are here to help turn your vision into reality.
            </TextReveal>
          </div>

          {(siteConfig.contact.phone || siteConfig.contact.email) && (
            <div className="mt-16 space-y-6 border-t border-near-black/10 pt-10 text-near-black">
              <div>
                <h3 className="eyebrow text-near-black/50 mb-2">Get in touch</h3>
                {siteConfig.contact.email && (
                  <a href={`mailto:${siteConfig.contact.email}`} className="block text-lg font-medium transition-colors hover:text-bronze">
                    {siteConfig.contact.email}
                  </a>
                )}
                {siteConfig.contact.phone && (
                  <a href={`tel:${siteConfig.contact.phone}`} className="mt-1 block text-lg font-medium transition-colors hover:text-bronze">
                    {siteConfig.contact.phone}
                  </a>
                )}
              </div>
              {siteConfig.contact.address && (
                <div>
                  <h3 className="eyebrow text-near-black/50 mb-2">Studio</h3>
                  <p className="max-w-[250px] leading-relaxed text-near-black/80">{siteConfig.contact.address}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Form */}
        <div>
          {status === "sent" ? (
            <div className="rounded-3xl bg-cream p-10 text-center shadow-sm lg:p-16">
              <p className="font-display text-3xl text-near-black">Thank you.</p>
              <p className="mt-4 text-near-black/70">Our design team has received your details and will reach out shortly to discuss your project.</p>
            </div>
          ) : (
            <div className="rounded-3xl bg-cream p-8 shadow-sm sm:p-10">
              <form onSubmit={onSubmit} noValidate className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Name *" error={errors.name}>
                    <input value={form.name} onChange={update("name")} className={inputClass} aria-invalid={!!errors.name} />
                  </Field>
                  <Field label="Phone *" error={errors.phone}>
                    <input value={form.phone} onChange={update("phone")} className={inputClass} aria-invalid={!!errors.phone} placeholder="98765 43210" />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input value={form.email} onChange={update("email")} className={inputClass} aria-invalid={!!errors.email} />
                  </Field>
                  <Field label="Location">
                    <input value={form.location} onChange={update("location")} className={inputClass} placeholder="City or Area" />
                  </Field>
                  <Field label="Property Type">
                    <input value={form.property_type} onChange={update("property_type")} className={inputClass} placeholder="Apartment, Villa, Office…" />
                  </Field>
                  <Field label="Approximate Budget">
                    <input value={form.budget} onChange={update("budget")} className={inputClass} placeholder="₹8–10 Lakhs" />
                  </Field>
                </div>
                <Field label="Project Type">
                  <input value={form.project_type} onChange={update("project_type")} className={inputClass} placeholder="New home, renovation, modular kitchen…" />
                </Field>
                <Field label="Message" error={errors.requirements}>
                  <textarea value={form.requirements} onChange={update("requirements")} rows={4} className={inputClass} placeholder="Tell us about your space..." />
                </Field>

                {status === "error" && (
                  <p className="text-sm text-red-700">Something went wrong sending your enquiry. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-4 w-full rounded-full bg-charcoal px-8 py-4 text-sm font-semibold tracking-wide text-ivory transition-colors hover:bg-near-black disabled:opacity-50 sm:w-auto sm:px-12"
                >
                  {status === "sending" ? "Sending…" : "Send Enquiry"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-near-black/10 bg-white/50 px-5 py-3.5 text-sm text-near-black outline-none transition-all placeholder:text-near-black/30 focus-visible:border-bronze focus-visible:bg-white";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-2 block font-medium text-near-black/80">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-red-700">{error}</span>}
    </label>
  );
}
