"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/Layout/ThemeSwitcher";
import { ArrowRightIcon } from "@/components/animated-icons/arrow-right";
import { MenuIcon } from "@/components/animated-icons/menu";
import { XIcon } from "@/components/animated-icons/x";
import { useHover, PlayIcon } from "./shared";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
  { id: "demo", label: "Live demo" },
  { id: "faq", label: "FAQ" },
];

export function scrollToSection(e: React.MouseEvent, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const [ctaHovered, ctaHover] = useHover();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || open
          ? "border-b border-border/60 bg-background/80 shadow-[0_1px_0_0_rgba(0,0,0,0.02)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="BillPartner home">
          <img src="/invoice-logo.svg" alt="" className="h-7 w-7" />
          <span className="text-[15px] font-semibold tracking-tight">BillPartner</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => scrollToSection(e, l.id)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeSwitcher />
          <Button asChild variant="ghost" size="sm" className="hidden text-sm font-medium sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden h-9 rounded-lg px-4 text-sm font-semibold sm:inline-flex"
            {...ctaHover}
          >
            <Link href="/register">
              Get started
              <PlayIcon icon={ArrowRightIcon} play={ctaHovered} size={16} className="-mr-1" />
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-muted/60 md:hidden"
          >
            {open ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => {
                    setOpen(false);
                    scrollToSection(e, l.id);
                  }}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
