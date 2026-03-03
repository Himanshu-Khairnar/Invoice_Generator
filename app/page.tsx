"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  BarChart3,
  FileText,
  Users,
  Send,
  Clock,
  TrendingUp,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/20">

      {/* ─── Background ─── */}
      <div className="fixed inset-0 -z-20 bg-background" />
      <div className="fixed inset-0 -z-10 [background-image:radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_55%,transparent_100%)]" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 -z-10 h-[520px] w-[720px] rounded-full bg-primary/20 blur-[150px] opacity-55 pointer-events-none" />

      {/* ─── Navbar ─── */}
      <header className="fixed top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-2xl">
        <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/invoice-logo.svg" alt="BillPartner" className="h-7 w-7" />
            <span className="font-bold tracking-tight text-[15px]">BillPartner</span>
          </Link>



          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-sm font-medium">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="h-8 rounded-md px-4 text-xs font-semibold shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Link href="/register">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-14">

        {/* ─── Hero ─── */}
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeUp}>
              <Badge
                variant="outline"
                className="mb-6 rounded-full border-primary/30 bg-primary/8 px-4 py-1.5 text-sm text-primary backdrop-blur-sm shadow-sm"
              >
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Invoicing made simple for freelancers
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl text-balance leading-[1.05]"
            >
              Get paid faster,{" "}
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                stress-free.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed text-balance"
            >
              Create professional invoices, send them to clients in seconds, and track every payment — all in one clean workspace.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-col sm:flex-row items-center gap-3">
              <Button asChild size="lg" className="h-11 rounded-lg px-8 font-semibold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5">
                <Link href="/register">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 rounded-lg px-8 font-medium border-border/60 bg-background/50 hover:bg-muted/40">
                <Link href="/login">Sign in</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* ─── Invoice Mockup ─── */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, type: "spring", stiffness: 60 }}
            className="relative mx-auto mt-20 max-w-3xl"
          >
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-2xl opacity-60" />

            <div className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/5">
              {/* Browser chrome */}
              <div className="flex items-center justify-between border-b border-border/30 bg-muted/30 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground border border-border/40">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="11" x="3" y="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  app.billpartner.com
                </div>
                <div className="w-14" />
              </div>

              <div className="p-6 md:p-10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-7 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <img src="/invoice-logo.svg" alt="logo" className="h-8 w-8" />
                    <div>
                      <p className="font-bold text-foreground">BillPartner</p>
                      <p className="text-xs text-muted-foreground">your@email.com</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-2xl font-bold text-foreground">INVOICE</p>
                    <p className="text-sm text-muted-foreground mt-0.5">#INV-2026-004</p>
                    <Badge className="mt-2 rounded-md bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
                      Pending
                    </Badge>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border/30">
                    <div className="col-span-7">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-3 text-right">Amount</div>
                  </div>
                  {[
                    { desc: "Website Design & Development", qty: "1", amt: "₹48,000" },
                    { desc: "Monthly Maintenance", qty: "3", amt: "₹18,000" },
                    { desc: "SEO Retainer", qty: "1", amt: "₹12,000" },
                  ].map((item, i) => (
                    <div key={i} className="grid grid-cols-12 text-sm py-2 rounded-md transition-colors hover:bg-muted/20 -mx-2 px-2">
                      <div className="col-span-7 font-medium text-foreground">{item.desc}</div>
                      <div className="col-span-2 text-center text-muted-foreground">{item.qty}</div>
                      <div className="col-span-3 text-right font-semibold text-foreground">{item.amt}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex justify-end pt-5 border-t border-border/30">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span><span className="font-medium text-foreground">₹78,000</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>GST (18%)</span><span className="font-medium text-foreground">₹14,040</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border/30">
                      <span className="font-semibold text-foreground">Total Due</span>
                      <span className="text-xl font-bold text-primary">₹92,040</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 16, x: 16 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 1.1, type: "spring", stiffness: 100 }}
              className="absolute -bottom-5 -right-4 md:-right-10 rounded-xl border border-border/40 bg-background/90 backdrop-blur-xl p-3.5 shadow-2xl flex items-center gap-3 ring-1 ring-white/5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Payment Received</p>
                <p className="text-xs text-muted-foreground">₹92,040 from Acme Corp</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ─── Bento Features Grid ─── */}
        <section id="features" className="border-y border-border/20 bg-muted/10 relative py-24">
          <div className="absolute inset-0 [background-image:linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />

          <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="mb-14"
            >
              <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                Features
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight sm:text-4xl max-w-xl">
                Everything you need, nothing you don&apos;t.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-3 text-muted-foreground text-lg max-w-lg">
                A focused toolkit for invoicing, clients, and payments — built for real daily use.
              </motion.p>
            </motion.div>

            {/* Bento Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto"
            >
              {/* Card 1 — Wide (2 cols), Lightning Fast */}
              <motion.div variants={fadeUp} className="md:col-span-2">
                <BentoCard
                  icon={<Zap className="h-5 w-5 text-primary" />}
                  tag="Editor"
                  title="Lightning Fast Invoice Creation"
                  description="Select a saved client, add your line items, and generate a polished invoice in under 60 seconds. No repetitive data entry."
                  accent="from-primary/12 via-primary/4 to-transparent"
                  visual={
                    <div className="mt-6 rounded-xl border border-border/40 bg-background/50 p-4 space-y-2.5">
                      {["Website Design — ₹48,000", "SEO Retainer — ₹12,000", "Maintenance — ₹6,000"].map((line, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                          <div className="flex-1 h-2 rounded-full bg-muted/80" style={{ width: `${85 - i * 15}%` }}>
                            <div className="h-full rounded-full bg-primary/25" style={{ width: "100%" }} />
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0 font-medium">{line.split("—")[1]?.trim()}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-border/30 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground font-medium">Total</span>
                        <span className="text-sm font-bold text-primary">₹66,000</span>
                      </div>
                    </div>
                  }
                />
              </motion.div>

              {/* Card 2 — Tall (1 col, 2 rows), Send Invoices */}
              <motion.div variants={fadeUp} className="md:row-span-2">
                <BentoCard
                  icon={<Send className="h-5 w-5 text-primary" />}
                  tag="Email"
                  title="Send Directly to Clients"
                  description="Email polished PDF invoices to your clients straight from the dashboard. No manual downloading or attaching files."
                  accent="from-teal-400/12 via-teal-400/4 to-transparent"
                  tall
                  visual={
                    <div className="mt-6 space-y-3">
                      <div className="rounded-xl border border-border/40 bg-background/50 p-3.5">
                        <div className="flex items-center gap-2 mb-2.5">
                          <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">AC</span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">Acme Corp</p>
                            <p className="text-[10px] text-muted-foreground">acme@example.com</p>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full rounded-full bg-muted/60" />
                          <div className="h-1.5 w-4/5 rounded-full bg-muted/60" />
                          <div className="h-1.5 w-3/5 rounded-full bg-muted/60" />
                        </div>
                        <div className="mt-3 flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                            <FileText className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-[10px] text-muted-foreground">INV-2026-004.pdf</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-primary/8 border border-primary/20 p-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-xs font-medium text-primary">Invoice delivered</span>
                      </div>
                      <div className="rounded-xl border border-border/40 bg-background/50 p-3 space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Upcoming</p>
                        {["TechVision — Due in 3d", "StartupXY — Due in 7d"].map((item) => (
                          <div key={item} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-foreground">{item.split("—")[0]}</span>
                            </div>
                            <span className="text-[10px] text-amber-500 font-medium">{item.split("—")[1]?.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                />
              </motion.div>

              {/* Card 3 — Normal, Client Profiles */}
              <motion.div variants={fadeUp} className="md:col-span-1">
                <BentoCard
                  icon={<Users className="h-5 w-5 text-primary" />}
                  tag="Clients"
                  title="Client Profiles"
                  description="Save client details once. Auto-fill them into any new invoice instantly."
                  accent="from-emerald-400/10 to-transparent"
                  visual={
                    <div className="mt-4 space-y-2">
                      {[
                        { name: "Acme Corp", initials: "AC", invoices: 12 },
                        { name: "TechVision", initials: "TV", invoices: 7 },
                        { name: "StartupXY", initials: "SX", invoices: 4 },
                      ].map((c) => (
                        <div key={c.name} className="flex items-center gap-2.5 rounded-lg border border-border/30 bg-background/40 px-3 py-2">
                          <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-primary">{c.initials}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground flex-1">{c.name}</span>
                          <span className="text-xs text-muted-foreground">{c.invoices} inv</span>
                        </div>
                      ))}
                    </div>
                  }
                />
              </motion.div>

              {/* Card 4 — Normal, Revenue Tracking */}
              <motion.div variants={fadeUp} className="md:col-span-1">
                <BentoCard
                  icon={<BarChart3 className="h-5 w-5 text-primary" />}
                  tag="Analytics"
                  title="Revenue Tracking"
                  description="Monitor paid, pending, and overdue invoices so your cash flow stays clear."
                  accent="from-emerald-300/10 to-transparent"
                  visual={
                    <div className="mt-4 space-y-2.5">
                      {[
                        { label: "Paid", value: "₹1,24,000", pct: 72, color: "bg-primary" },
                        { label: "Pending", value: "₹38,500", pct: 22, color: "bg-amber-400" },
                        { label: "Overdue", value: "₹10,200", pct: 6, color: "bg-destructive" },
                      ].map((r) => (
                        <div key={r.label} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{r.label}</span>
                            <span className="font-semibold text-foreground">{r.value}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted/50">
                            <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                />
              </motion.div>

              {/* Card 5 — Full Width (3 cols), PDF & Security */}
              <motion.div variants={fadeUp} className="md:col-span-3">
                <div className="grid sm:grid-cols-2 gap-4 h-full">
                  <BentoCard
                    icon={<FileText className="h-5 w-5 text-primary" />}
                    tag="PDF"
                    title="Branded PDF Invoices"
                    description="Generate pixel-perfect, branded PDFs with your logo, business address, and bank details — ready to send or download instantly."
                    accent="from-teal-300/10 to-transparent"
                    horizontal
                  />
                  <BentoCard
                    icon={<ShieldCheck className="h-5 w-5 text-primary" />}
                    tag="Security"
                    title="Secure by Default"
                    description="Your invoices and client data are encrypted and protected. Access everything from any device, any time, with confidence."
                    accent="from-primary/10 to-transparent"
                    horizontal
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative border-t border-border/20 overflow-hidden py-24">
          <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[300px] w-[500px] rounded-full bg-primary/20 blur-[100px] opacity-50" />

          <div className="container relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <Badge variant="outline" className="mb-6 rounded-full border-primary/25 bg-primary/8 px-4 py-1.5 text-sm text-primary">
                  Start today — it&apos;s free
                </Badge>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl font-extrabold tracking-tight sm:text-5xl text-balance">
                Stop chasing payments.<br />
                <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                  Start doing great work.
                </span>
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-lg text-muted-foreground max-w-md mx-auto">
                Join thousands of freelancers and teams using BillPartner to streamline their invoicing.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="h-12 rounded-lg px-8 font-semibold shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5">
                  <Link href="/register">
                    Create free account <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-lg px-8 font-medium border-border/50">
                  <Link href="/login">Sign in instead</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/20 bg-background py-10">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 sm:flex-row sm:px-6 text-sm">
          <div className="flex items-center gap-2">
            <img src="/invoice-logo.svg" alt="BillPartner" className="h-5 w-5" />
            <span className="font-bold tracking-tight">BillPartner</span>
          </div>
          <p className="text-muted-foreground text-xs">© {new Date().getFullYear()} BillPartner. All rights reserved.</p>
          <div className="flex gap-5 font-medium text-muted-foreground text-xs">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="https://github.com/Himanshu-Khairnar/Invoice_Generator" className="hover:text-foreground transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Bento Card Component ───
function BentoCard({
  icon,
  tag,
  title,
  description,
  accent,
  visual,
  tall = false,
  horizontal = false,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  accent: string;
  visual?: React.ReactNode;
  tall?: boolean;
  horizontal?: boolean;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg p-6 ${tall ? "h-full" : ""} ${horizontal ? "flex gap-5 items-start" : ""}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className={`relative z-10 ${horizontal ? "flex gap-5 items-start w-full" : ""}`}>
        {horizontal ? (
          <>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background shadow-sm group-hover:scale-105 group-hover:border-primary/30 transition-all duration-300">
              {icon}
            </div>
            <div>
              <Badge variant="secondary" className="mb-2 rounded-md text-xs px-2 py-0.5 bg-primary/8 text-primary border-primary/20">
                {tag}
              </Badge>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-background shadow-sm group-hover:scale-105 group-hover:border-primary/30 transition-all duration-300">
                {icon}
              </div>
              <Badge variant="secondary" className="rounded-md text-xs px-2 py-0.5 bg-primary/8 text-primary border-primary/20">
                {tag}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
            {visual}
          </>
        )}
      </div>
    </div>
  );
}
