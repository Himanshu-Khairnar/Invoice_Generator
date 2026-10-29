"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/animated-icons/chevron-down";
import { ArrowUpRightIcon } from "@/components/animated-icons/arrow-up-right";
import { GithubIcon } from "@/components/animated-icons/github";
import { SectionHeading, fadeUp, stagger, useHover, PlayIcon } from "./shared";
import { NAV_LINKS, scrollToSection } from "./Navbar";

/* ─────────────────────────── FAQ ─────────────────────────── */

const FAQS = [
  {
    q: "Is BillPartner free to use?",
    a: "Yes. You can sign up, add clients and items, and create and send invoices without entering any card details.",
  },
  {
    q: "Does it handle GST?",
    a: "Yes. Add your GSTIN in settings, choose a tax rate per invoice, and BillPartner calculates the tax and totals automatically on both the invoice and the PDF.",
  },
  {
    q: "How do clients receive and pay invoices?",
    a: "Send the invoice by email straight from the dashboard. Your client gets a branded PDF and a link to a secure, OTP-verified payment page.",
  },
  {
    q: "Can I add my logo and bank details?",
    a: "Yes. Upload your logo and save your business address and bank details once — they appear on every invoice automatically.",
  },
  {
    q: "Is my data secure?",
    a: "Your data lives behind your account with hashed passwords and token-based sessions. Only you can see your invoices and clients.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-20 py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Can't find what you're looking for? Open an issue on GitHub and we'll get back to you."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="divide-y divide-border/70 border-y border-border/70"
        >
          {FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              {...f}
              open={open === i}
              onToggle={() => setOpen((o) => (o === i ? null : i))}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  const [iconHovered, iconHover] = useHover();
  return (
    <motion.div variants={fadeUp}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          {...iconHover}
          className="group flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
        >
          {q}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground group-hover:border-emerald-500/40 group-hover:text-foreground"
          >
            <PlayIcon icon={ChevronDownIcon} play={iconHovered} size={16} />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 pr-12 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────── CTA ─────────────────────────── */

export function Cta() {
  const [ctaHovered, ctaHover] = useHover();
  return (
    <section className="px-4 pb-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 70, damping: 20 }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-neutral-950 px-6 py-16 text-center text-white sm:px-12 sm:py-20"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,#000_30%,transparent_100%)]" />
        <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-400/30 blur-[100px]" />

        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Stop chasing payments. Start doing your best work.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-white/70 sm:text-lg">
            Set up your business profile once and send your first professional invoice today.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-[#72e3ad] px-7 text-[15px] font-semibold text-neutral-950 hover:bg-[#8aeabd]"
              {...ctaHover}
            >
              <Link href="/register">
                Create free account
                <PlayIcon icon={ArrowUpRightIcon} play={ctaHovered} size={18} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 rounded-xl px-7 text-[15px] font-medium text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────── Footer ─────────────────────────── */

export function Footer() {
  const [ghHovered, ghHover] = useHover();
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2">
            <img src="/invoice-logo.svg" alt="" className="h-6 w-6" />
            <span className="font-semibold tracking-tight">BillPartner</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Simple, professional invoicing for freelancers and small businesses.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          <FooterCol title="Product">
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={(e) => scrollToSection(e, l.id)} className={linkCls}>
                {l.label}
              </a>
            ))}
          </FooterCol>
          <FooterCol title="Account">
            <Link href="/register" className={linkCls}>Create account</Link>
            <Link href="/login" className={linkCls}>Sign in</Link>
          </FooterCol>
          <FooterCol title="Legal">
            <Link href="/terms" className={linkCls}>Terms</Link>
            <Link href="/privacy" className={linkCls}>Privacy</Link>
          </FooterCol>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} BillPartner. All rights reserved.</p>
          <a
            href="https://github.com/Himanshu-Khairnar/Invoice_Generator"
            target="_blank"
            rel="noreferrer"
            {...ghHover}
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:text-foreground"
          >
            <PlayIcon icon={GithubIcon} play={ghHovered} size={16} />
            Star on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

const linkCls = "text-muted-foreground transition-colors hover:text-foreground";

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="font-medium text-foreground">{title}</p>
      {children}
    </div>
  );
}
