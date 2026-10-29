"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/animated-icons/arrow-right";
import { SparklesIcon } from "@/components/animated-icons/sparkles";
import { CircleCheckIcon } from "@/components/animated-icons/circle-check";
import { ACCENT_TEXT, fadeUp, inr, stagger, useHover, PlayIcon } from "./shared";
import { scrollToSection } from "./Navbar";
import { cn } from "@/lib/utils";

const TRUST = ["Free to start", "GST-ready invoices", "No credit card"];

export function Hero() {
  const [primaryHovered, primaryHover] = useHover();
  const [badgeHovered, badgeHover] = useHover();

  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:pt-40">
      <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}>
            <a
              href="#demo"
              onClick={(e) => scrollToSection(e, "demo")}
              {...badgeHover}
              className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 py-1 pl-1 pr-3 text-sm shadow-sm backdrop-blur transition-colors hover:border-emerald-500/40"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/25 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-primary/40 dark:text-emerald-200">
                <PlayIcon icon={SparklesIcon} play={badgeHovered} size={13} />
                New
              </span>
              <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                Try the live invoice builder
              </span>
            </a>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]"
          >
            Invoicing that gets you{" "}
            <span className="relative whitespace-nowrap">
              <span className={ACCENT_TEXT}>paid faster</span>
              <motion.svg
                aria-hidden
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 h-3 w-full text-primary"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 9 C 80 2, 200 2, 298 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: "easeInOut" }}
                />
              </motion.svg>
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            Create branded, GST-ready invoices in under a minute, email them straight to
            clients, and see exactly what&apos;s paid, pending, and overdue — from one calm
            workspace.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl px-6 text-[15px] font-semibold shadow-lg shadow-emerald-500/20 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              {...primaryHover}
            >
              <Link href="/register">
                Create your first invoice
                <PlayIcon icon={ArrowRightIcon} play={primaryHovered} size={18} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-border/80 bg-background/60 px-6 text-[15px] font-medium backdrop-blur"
            >
              <a href="#how-it-works" onClick={(e) => scrollToSection(e, "how-it-works")}>
                See how it works
              </a>
            </Button>
          </motion.div>

          <motion.ul variants={fadeUp} className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {TRUST.map((t) => (
              <TrustItem key={t} label={t} />
            ))}
          </motion.ul>
        </motion.div>

        <InvoiceMockup />
      </div>
    </section>
  );
}

function TrustItem({ label }: { label: string }) {
  const [iconHovered, iconHover] = useHover();
  return (
    <li {...iconHover} className="flex items-center gap-2 text-sm text-muted-foreground">
      <PlayIcon icon={CircleCheckIcon} play={iconHovered} size={16} className={ACCENT_TEXT} />
      {label}
    </li>
  );
}

/* ───────────────────────── Interactive invoice mockup ───────────────────────── */

const STATUSES = [
  { key: "draft", label: "Draft", cls: "bg-muted text-muted-foreground border-border" },
  { key: "sent", label: "Sent", cls: "bg-sky-500/10 text-sky-700 border-sky-500/25 dark:text-sky-300" },
  { key: "paid", label: "Paid", cls: "bg-emerald-500/12 text-emerald-700 border-emerald-500/25 dark:text-emerald-300" },
] as const;

const LINES = [
  { desc: "Website design & development", qty: 1, rate: 48000 },
  { desc: "Monthly maintenance", qty: 3, rate: 6000 },
  { desc: "SEO retainer", qty: 1, rate: 12000 },
];

function InvoiceMockup() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  // Cycle Draft → Sent → Paid to tell the product story without words.
  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setStep((s) => (s + 1) % STATUSES.length), 2400);
    return () => clearInterval(t);
  }, [paused, reduce]);

  // Subtle 3D tilt that follows the pointer.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });

  const subtotal = LINES.reduce((a, l) => a + l.qty * l.rate, 0);
  const gst = Math.round(subtotal * 0.18);
  const status = STATUSES[step];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, type: "spring", stiffness: 60, damping: 18 }}
      className="relative [perspective:1200px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        mx.set(0);
        my.set(0);
      }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/40 via-primary/10 to-transparent opacity-70 blur-3xl" />

      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_30px_80px_-20px_rgba(16,24,40,0.25)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/60 p-6">
          <div className="flex items-center gap-3">
            <img src="/invoice-logo.svg" alt="" className="h-9 w-9" />
            <div>
              <p className="text-sm font-semibold">Studio Nine</p>
              <p className="text-xs text-muted-foreground">Billed to Acme Corp</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-muted-foreground">INV-2026-004</p>
            <div className="mt-1.5 h-6">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={status.key}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    status.cls,
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {status.label}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Lines */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-12 border-b border-border/60 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-7">Item</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-3 text-right">Amount</div>
          </div>
          {LINES.map((l, i) => (
            <motion.div
              key={l.desc}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="-mx-2 grid grid-cols-12 rounded-md px-2 py-2.5 text-sm transition-colors hover:bg-muted/50"
            >
              <div className="col-span-7 truncate font-medium">{l.desc}</div>
              <div className="col-span-2 text-center tabular-nums text-muted-foreground">{l.qty}</div>
              <div className="col-span-3 text-right font-medium tabular-nums">{inr.format(l.qty * l.rate)}</div>
            </motion.div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-2 flex justify-end border-t border-border/60 px-6 py-5">
          <dl className="w-full max-w-[15rem] space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Subtotal</dt>
              <dd className="tabular-nums text-foreground">{inr.format(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>GST 18%</dt>
              <dd className="tabular-nums text-foreground">{inr.format(gst)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
              <dt className="font-semibold">Total due</dt>
              <dd className={cn("text-lg font-semibold tabular-nums", ACCENT_TEXT)}>
                {inr.format(subtotal + gst)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Progress rail */}
        <div className="flex items-center gap-2 border-t border-border/60 bg-muted/40 px-6 py-3">
          {STATUSES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStep(i)}
              className="group flex flex-1 flex-col gap-1.5 text-left"
              aria-label={`Show ${s.label} state`}
            >
              <span className="h-1 w-full overflow-hidden rounded-full bg-border">
                <motion.span
                  className="block h-full rounded-full bg-emerald-500"
                  initial={false}
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium transition-colors",
                  i <= step ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Payment toast */}
      <AnimatePresence>
        {status.key === "paid" && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute -bottom-6 -left-3 flex items-center gap-3 rounded-xl border border-border/70 bg-background/95 p-3 pr-4 shadow-xl backdrop-blur sm:-left-8"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <PlayingCheck />
            </span>
            <div>
              <p className="text-sm font-semibold">Payment received</p>
              <p className="text-xs text-muted-foreground">
                {inr.format(subtotal + gst)} from Acme Corp
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Check icon that animates as soon as it mounts. */
function PlayingCheck() {
  return <PlayIcon icon={CircleCheckIcon} play size={20} />;
}
