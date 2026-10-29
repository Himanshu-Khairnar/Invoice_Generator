"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { UserPlusIcon } from "@/components/animated-icons/user-plus";
import { ReceiptIndianRupeeIcon } from "@/components/animated-icons/receipt-indian-rupee";
import { MailCheckIcon } from "@/components/animated-icons/mail-check";
import {
  ACCENT_TEXT,
  SectionHeading,
  fadeUp,
  stagger,
  PlayIcon,
  useHover,
  useViewPulse,
} from "./shared";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: UserPlusIcon,
    title: "Add your business & clients",
    description: "Set up your logo, GSTIN, and bank details once. Save clients and the items you bill for most.",
  },
  {
    icon: ReceiptIndianRupeeIcon,
    title: "Build the invoice",
    description: "Pick a client, add line items, and taxes and totals calculate themselves. Preview the PDF as you go.",
  },
  {
    icon: MailCheckIcon,
    title: "Send it and get paid",
    description: "Email it in one click. Clients open a secure payment page, and the invoice flips to paid.",
  },
];

export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="scroll-mt-20 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          center
          eyebrow="How it works"
          title="From blank page to paid in three steps"
          description="No setup calls, no spreadsheets. You can send your first invoice minutes after signing up."
        />

        <motion.ol
          ref={listRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6"
        >
          {/* Progress line that fills as you scroll */}
          <div aria-hidden className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-border md:block">
            <motion.div style={{ scaleX }} className="h-full origin-left bg-emerald-500" />
          </div>

          {STEPS.map((s, i) => (
            <Step key={s.title} index={i} {...s} />
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

function Step({
  icon: Icon,
  title,
  description,
  index,
}: (typeof STEPS)[number] & { index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const [iconHovered, iconHover] = useHover();
  const iconPulse = useViewPulse(ref, 300 + index * 250);

  return (
    <motion.li ref={ref} variants={fadeUp} {...iconHover} className="group relative flex flex-col items-center text-center">
      <div
        className={cn(
          "relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-background shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-emerald-500/40 group-hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.45)]",
          ACCENT_TEXT,
        )}
      >
        <PlayIcon icon={Icon} play={iconHovered || iconPulse} size={24} />
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
          {index + 1}
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p>
    </motion.li>
  );
}
