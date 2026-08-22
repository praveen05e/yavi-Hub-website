"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

type ChatMsg = { role: "user" | "assistant"; content: string };

function makeSessionId() {
  return `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "Welcome to YAVI. Let's understand your space and create something that feels like you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [errorFallback, setErrorFallback] = useState(false);
  const [pendingContext, setPendingContext] = useState<Record<string, unknown> | undefined>(undefined);
  const sessionId = useRef(makeSessionId());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.context) setPendingContext(detail.context);
      setOpen(true);
    };
    window.addEventListener("yavi:open-chat", handler);
    return () => window.removeEventListener("yavi:open-chat", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setSending(true);
    try {
      const res = await api.sendChatMessage({
        session_id: sessionId.current,
        message: text,
        context: pendingContext,
      });
      setPendingContext(undefined);
      setMessages((m) => [...m, { role: "assistant", content: (res as any).reply }]);
      setErrorFallback(false);
    } catch {
      setErrorFallback(true);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please use the contact form and our team will reach out directly.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open YAVI Design Concierge"
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-charcoal px-5 py-3.5 text-sm font-medium text-ivory shadow-xl transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 ${
          open ? "scale-0" : "scale-100"
        }`}
      >
        <Sparkles size={16} />
        Design Concierge
      </button>

      {/* Panel */}
      <div
        className={`fixed z-50 flex flex-col bg-ivory shadow-2xl transition-all duration-500 ease-out-expo
          inset-x-0 bottom-0 h-[85vh] rounded-t-2xl
          sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-2xl
          ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
        role="dialog"
        aria-modal="true"
        aria-label="YAVI Design Concierge"
      >
        <div className="flex items-center justify-between border-b border-near-black/10 px-5 py-4">
          <div>
            <div className="font-display text-lg text-near-black">Design Concierge</div>
            <div className="text-xs text-near-black/50">YAVI</div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1.5">
            <X size={20} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed animate-message ${
                  m.role === "user" ? "bg-charcoal text-ivory" : "bg-cream text-near-black"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-cream px-4 py-2.5 text-sm text-near-black/50">Typing…</div>
            </div>
          )}
        </div>

        <div className="border-t border-near-black/10 p-4 pb-6 sm:pb-4">
          {errorFallback ? (
            <a
              href="/contact"
              className="block rounded-full bg-charcoal px-5 py-3 text-center text-sm font-medium text-ivory"
            >
              Go to contact form
            </a>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell me about your space…"
                className="flex-1 rounded-full border border-near-black/15 bg-white px-4 py-2.5 text-sm text-near-black outline-none focus-visible:border-bronze"
                aria-label="Message"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-ivory disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
