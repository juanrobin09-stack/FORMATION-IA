"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  GraduationCap,
  Library,
  FileText,
  Database,
  Sparkles,
  Settings,
  TrendingUp,
  Boxes,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/magique", label: "Formation complete", icon: Sparkles, highlight: true },
  { href: "/crm", label: "CRM", icon: Users },
  { href: "/strategie", label: "Strategie commerciale", icon: TrendingUp },
  { href: "/audit", label: "Audit IA", icon: ClipboardCheck },
  { href: "/formation", label: "Generateur", icon: GraduationCap },
  { href: "/outils", label: "Outils IA", icon: Boxes },
  { href: "/bibliotheque", label: "Bibliotheque", icon: Library },
  { href: "/devis", label: "Devis", icon: FileText },
  { href: "/base-connaissances", label: "Connaissances", icon: Database },
  { href: "/parametres", label: "Parametres", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-zinc-200 bg-white lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Formator AI</div>
          <div className="text-xs text-zinc-400">Formations IA en 10 min</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-zinc-100 text-ink"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-ink",
                item.highlight && !active
                  ? "text-brand-600 hover:text-brand-700"
                  : "",
              ].join(" ")}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 text-xs text-zinc-400">
        V1 - Mono-utilisateur
      </div>
    </aside>
  );
}
