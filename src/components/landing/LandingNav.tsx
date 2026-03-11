"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer } from "vaul";
import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { cn } from "@/lib/utils";

interface LandingNavProps {
  earlyAccessLabel: string;
  navLinks: Array<{ href: string; label: string }>;
}

export default function LandingNav({ earlyAccessLabel, navLinks }: LandingNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const params = useParams();
  const locale = params.locale as string;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-sm bg-white/80">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-cyan rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <span className="font-mono text-sm font-medium text-ink tracking-wide">PAWMEDIC</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <a
            href="#guides"
            className="hidden sm:inline-flex items-center px-4 py-2 bg-[#0d9488] text-white text-sm font-medium rounded-xl hover:bg-[#0f766e] transition-colors"
          >
            {earlyAccessLabel}
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden w-8 h-8 flex items-center justify-center text-ink"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2rem] px-5 pt-4 pb-10">
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-base text-ink border-b border-border/50"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 space-y-3">
              <LanguageSwitcher variant="compact" />
              <a
                href="#guides"
                onClick={() => setMobileOpen(false)}
                className="block w-full py-3 bg-[#0d9488] text-white text-sm font-medium rounded-xl text-center"
              >
                {earlyAccessLabel}
              </a>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </header>
  );
}
