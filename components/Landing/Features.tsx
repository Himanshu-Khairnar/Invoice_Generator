"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ZapIcon } from "@/components/animated-icons/zap";
import { SendIcon } from "@/components/animated-icons/send";
import { UsersIcon } from "@/components/animated-icons/users";
import { ChartColumnIncreasingIcon } from "@/components/animated-icons/chart-column-increasing";
import { FileTextIcon } from "@/components/animated-icons/file-text";
import { ShieldCheckIcon } from "@/components/animated-icons/shield-check";
import { ClockIcon } from "@/components/animated-icons/clock";
import {
  ACCENT_TEXT,
  type AnimatedIcon,
  SectionHeading,
  fadeUp,
  inr,
  stagger,
  PlayIcon,
  useHover,
  useViewPulse,
} from "./shared";
import { cn } from "@/lib/utils";

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-20 border-y border-border/60 bg-muted/30 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to bill clients. Nothing you don't."
          description="A focused toolkit for invoices, clients, and payments — designed for the way freelancers and small teams actually work."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <FeatureCard
            className="md:col-span-2"
            icon={ZapIcon}
            title="Invoices in under 60 seconds"
            description="Pick a saved client, drop in catalog items, and BillPartner handles numbering, tax, and totals for you."
          >
            <FastVisual />
          </FeatureCard>

          <FeatureCard
            className="md:row-span-2"
            icon={SendIcon}
            title="Send straight to clients"
            description="Email a polished PDF from the dashboard — no downloading, attaching, or copy-pasting."
          >
            <SendVisual />
          </FeatureCard>

          <FeatureCard
            icon={UsersIcon}
            title="Client profiles"
            description="Save details once and auto-fill them into every new invoice."
          >
            <ClientsVisual />
          </FeatureCard>

          <FeatureCard
            icon={ChartColumnIncreasingIcon}
            title="Revenue at a glance"
            description="Track paid, pending, and overdue so cash flow never surprises you."
          >
            <RevenueVisual />
          </FeatureCard>

          <FeatureCard
            className="md:col-span-3 lg:col-span-1"
            icon={FileTextIcon}
            title="Branded PDF invoices"
            description="Your logo, address, and bank details on every page — ready to download or send."
          />
          <FeatureCard
            className="md:col-span-3 lg:col-span-2"
            icon={ShieldCheckIcon}
            title="Private and secure by default"
            description="Your invoices and client data stay behind your account, with OTP-verified payment pages for clients. Access everything from any device."
          />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
  children,
}: {
  icon: AnimatedIcon;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [iconHovered, iconHover] = useHover();
  const iconPulse = useViewPulse(cardRef, 400);

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      {...iconHover}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-background p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-[0_12px_40px_-12px_rgba(16,24,40,0.18)]",
        className,
      )}
    >
      {/* Cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%)",
        }}
      />
      <div className="relative">
        <div
          className={cn(
            "mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-muted/50 transition-colors duration-300 group-hover:border-emerald-500/30 group-hover:bg-primary/15",
            ACCENT_TEXT,
          )}
        >
          <PlayIcon icon={Icon} play={iconHovered || iconPulse} size={20} />
        </div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {children && <div className="relative mt-6 flex-1">{children}</div>}
    </motion.div>
  );
}

/* ───────── Card visuals ───────── */

function FastVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const items = [
    { name: "Website design", amt: 48000 },
    { name: "SEO retainer", amt: 12000 },
    { name: "Maintenance", amt: 6000 },
  ];
  return (
    <div ref={ref} className="rounded-xl border border-border/70 bg-muted/30 p-4">
      <div className="space-y-2">
        {items.map((it, i) => (
          <motion.div
            key={it.name}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.15 }}
            className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm shadow-sm"
          >
            <span className="font-medium">{it.name}</span>
            <span className="tabular-nums text-muted-foreground">{inr.format(it.amt)}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-sm">
        <span className="text-muted-foreground">Total incl. GST</span>
        <span className={cn("font-semibold tabular-nums", ACCENT_TEXT)}>{inr.format(77880)}</span>
      </div>
    </div>
  );
}

function SendVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-3">
      <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/25 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
            AC
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Acme Corp</p>
            <p className="truncate text-xs text-muted-foreground">billing@acme.co</p>
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-border" />
          <div className="h-1.5 w-4/5 rounded-full bg-border" />
          <div className="h-1.5 w-3/5 rounded-full bg-border" />
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background px-2 py-1 text-xs text-muted-foreground">
          <span className="font-mono">INV-2026-004.pdf</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" /> Delivered · just now
      </motion.div>
      <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Coming up</p>
        {[
          { name: "TechVision", due: "Due in 3 days" },
          { name: "StartupXY", due: "Due in 7 days" },
        ].map((r) => (
          <DueRow key={r.name} {...r} />
        ))}
      </div>
    </div>
  );
}

function DueRow({ name, due }: { name: string; due: string }) {
  const [iconHovered, iconHover] = useHover();
  return (
    <div {...iconHover} className="mt-2.5 flex items-center justify-between text-sm">
      <span className="flex items-center gap-2">
        <PlayIcon icon={ClockIcon} play={iconHovered} size={14} className="text-muted-foreground" />
        {name}
      </span>
      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{due}</span>
    </div>
  );
}

function ClientsVisual() {
  const clients = [
    { name: "Acme Corp", initials: "AC", n: 12 },
    { name: "TechVision", initials: "TV", n: 7 },
    { name: "StartupXY", initials: "SX", n: 4 },
  ];
  return (
    <div className="space-y-2">
      {clients.map((c) => (
        <div
          key={c.name}
          className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/60"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/25 text-[10px] font-semibold text-emerald-800 dark:text-emerald-200">
            {c.initials}
          </span>
          <span className="flex-1 text-sm font-medium">{c.name}</span>
          <span className="text-xs tabular-nums text-muted-foreground">{c.n} invoices</span>
        </div>
      ))}
    </div>
  );
}

function RevenueVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const rows = [
    { label: "Paid", value: 124000, pct: 72, color: "bg-emerald-500" },
    { label: "Pending", value: 38500, pct: 22, color: "bg-amber-400" },
    { label: "Overdue", value: 10200, pct: 6, color: "bg-rose-500" },
  ];
  return (
    <div ref={ref} className="space-y-3">
      {rows.map((r, i) => (
        <div key={r.label}>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="font-semibold tabular-nums">{inr.format(r.value)}</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <motion.div
              className={cn("h-full rounded-full", r.color)}
              initial={{ width: 0 }}
              animate={inView ? { width: `${r.pct}%` } : {}}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
