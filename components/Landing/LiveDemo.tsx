"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/animated-icons/arrow-right";
import { ACCENT_TEXT, AnimatedNumber, SectionHeading, inr, useHover, PlayIcon } from "./shared";
import { cn } from "@/lib/utils";

const GST_RATES = [0, 5, 12, 18, 28];

const CATALOG = [
  { id: "design", name: "UI/UX design (per screen)", rate: 4500 },
  { id: "dev", name: "Frontend development (per day)", rate: 9000 },
  { id: "consult", name: "Strategy consultation (per hour)", rate: 2500 },
];

export function LiveDemo() {
  const [qty, setQty] = useState<Record<string, number>>({ design: 6, dev: 4, consult: 2 });
  const [gstRate, setGstRate] = useState(18);
  const [ctaHovered, ctaHover] = useHover();

  const subtotal = CATALOG.reduce((a, it) => a + it.rate * (qty[it.id] ?? 0), 0);
  const tax = Math.round((subtotal * gstRate) / 100);
  const total = subtotal + tax;

  const change = (id: string, d: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(99, (q[id] ?? 0) + d)) }));

  return (
    <section id="demo" className="scroll-mt-20 border-y border-border/60 bg-muted/30 py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Live demo"
            title="Try the invoice builder — right here."
            description="Change quantities and the tax slab. Totals update instantly, exactly like they do inside BillPartner."
          />
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className={cn("font-semibold", ACCENT_TEXT)}>01</span>
              Every GST slab, calculated on the fly
            </li>
            <li className="flex gap-3">
              <span className={cn("font-semibold", ACCENT_TEXT)}>02</span>
              Reusable catalog items with saved rates
            </li>
            <li className="flex gap-3">
              <span className={cn("font-semibold", ACCENT_TEXT)}>03</span>
              Amounts formatted the Indian way — lakhs and crores
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/70 bg-background p-5 shadow-[0_20px_60px_-24px_rgba(16,24,40,0.25)] sm:p-7">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">New invoice</p>
            <span className="font-mono text-xs text-muted-foreground">INV-2026-005</span>
          </div>

          <div className="mt-5 divide-y divide-border/60 rounded-xl border border-border/70">
            {CATALOG.map((it) => {
              const q = qty[it.id] ?? 0;
              return (
                <div
                  key={it.id}
                  className={cn(
                    "grid grid-cols-[1fr_auto] items-center gap-3 p-3.5 transition-opacity sm:grid-cols-[1fr_auto_6.5rem]",
                    q === 0 && "opacity-50",
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{it.name}</p>
                    <p className="text-xs tabular-nums text-muted-foreground">{inr.format(it.rate)} each</p>
                  </div>
                  <div className="flex items-center rounded-lg border border-border/70 bg-muted/40">
                    <QtyButton label={`Decrease ${it.name}`} onClick={() => change(it.id, -1)} disabled={q === 0}>
                      <Minus className="h-3.5 w-3.5" />
                    </QtyButton>
                    <span className="relative w-8 overflow-hidden text-center text-sm font-semibold tabular-nums">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={q}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="inline-block"
                        >
                          {q}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <QtyButton label={`Increase ${it.name}`} onClick={() => change(it.id, 1)} disabled={q === 99}>
                      <Plus className="h-3.5 w-3.5" />
                    </QtyButton>
                  </div>
                  <AnimatedNumber
                    value={it.rate * q}
                    className="col-span-2 text-right text-sm font-medium tabular-nums sm:col-span-1"
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium text-muted-foreground">GST slab</p>
            <div role="radiogroup" aria-label="GST rate" className="mt-2 inline-flex rounded-lg border border-border/70 bg-muted/40 p-1">
              {GST_RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={gstRate === r}
                  onClick={() => setGstRate(r)}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-xs font-semibold tabular-nums transition-colors",
                    gstRate === r ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {gstRate === r && (
                    <motion.span
                      layoutId="gst-pill"
                      className="absolute inset-0 rounded-md bg-background shadow-sm ring-1 ring-border/70"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{r}%</span>
                </button>
              ))}
            </div>
          </div>

          <dl className="mt-6 space-y-2 border-t border-border/60 pt-5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Subtotal</dt>
              <dd className="text-foreground"><AnimatedNumber value={subtotal} className="tabular-nums" /></dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>GST ({gstRate}%)</dt>
              <dd className="text-foreground"><AnimatedNumber value={tax} className="tabular-nums" /></dd>
            </div>
            <div className="flex items-end justify-between pt-2">
              <dt className="font-semibold">Total due</dt>
              <dd>
                <AnimatedNumber value={total} className={cn("text-2xl font-semibold tabular-nums tracking-tight", ACCENT_TEXT)} />
              </dd>
            </div>
          </dl>

          <Button asChild className="mt-6 h-11 w-full rounded-xl font-semibold" {...ctaHover}>
            <Link href="/register">
              Create this invoice for real
              <PlayIcon icon={ArrowRightIcon} play={ctaHovered} size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function QtyButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.85 }}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </motion.button>
  );
}
