"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  isCenter?: boolean;
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function DiagnoseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M11 8v3l2 2" />
      <path d="M20 20l-2.5-2.5" />
    </svg>
  );
}

function CarnetIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {/* Home */}
        <Link
          href="/dashboard"
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors",
            isActive("/dashboard") ? "text-cyan" : "text-muted hover:text-ink"
          )}
        >
          <HomeIcon active={isActive("/dashboard")} />
          <span className="text-xs font-mono">Accueil</span>
        </Link>

        {/* Diagnose - center highlight */}
        <Link href="/diagnose" className="flex flex-col items-center gap-0.5 -mt-5">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95",
            isActive("/diagnose") ? "bg-cyan-dark" : "bg-cyan"
          )}>
            <DiagnoseIcon />
          </div>
          <span className={cn(
            "text-xs font-mono mt-0.5",
            isActive("/diagnose") ? "text-cyan" : "text-muted"
          )}>Analyser</span>
        </Link>

        {/* Carnet */}
        <Link
          href="/carnet"
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors",
            isActive("/carnet") ? "text-cyan" : "text-muted hover:text-ink"
          )}
        >
          <CarnetIcon active={isActive("/carnet")} />
          <span className="text-xs font-mono">Carnet</span>
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors",
            isActive("/profile") ? "text-cyan" : "text-muted hover:text-ink"
          )}
        >
          <ProfileIcon active={isActive("/profile")} />
          <span className="text-xs font-mono">Profil</span>
        </Link>
      </div>
    </nav>
  );
}
