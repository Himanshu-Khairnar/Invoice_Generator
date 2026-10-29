"use client";

import { MotionConfig } from "framer-motion";

/** Page wrapper: honours prefers-reduced-motion and draws the ambient background. */
export function LandingShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex min-h-screen flex-col overflow-x-clip bg-background font-[family-name:var(--font-geist-sans)] text-foreground selection:bg-primary/40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-12rem] -z-10 h-[34rem] w-[56rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px] dark:bg-primary/40"
        />
        {children}
      </div>
    </MotionConfig>
  );
}
