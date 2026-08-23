"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Settings } from "lucide-react";
import { clearToken } from "@/lib/adminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  const nav = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/leads", label: "Leads", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const logout = () => {
    clearToken();
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F3] text-near-black">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-near-black/10 bg-white sm:flex">
        <div className="px-6 py-6 font-display text-xl">YAVI Admin</div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-charcoal text-ivory" : "text-near-black/70 hover:bg-near-black/5"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="mx-3 mb-6 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-near-black/60 hover:bg-near-black/5"
        >
          <LogOut size={16} />
          Log out
        </button>
      </aside>
      <main className="flex-1 overflow-x-hidden pb-16 sm:pb-0">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-near-black/10 bg-white p-2 sm:hidden pb-safe">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs transition-colors ${
                active ? "text-charcoal font-medium" : "text-near-black/60"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 rounded-lg p-2 text-xs text-red-600/80 transition-colors"
        >
          <LogOut size={20} />
          Log out
        </button>
      </nav>
    </div>
  );
}
