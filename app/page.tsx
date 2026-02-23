"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Users, 
  CreditCard 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <FileText size={16} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Invoice<span className="text-primary/80">Flow</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              How it Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="text-sm font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container relative mx-auto max-w-7xl px-4 pt-24 pb-24 sm:px-6 lg:pt-32 lg:pb-40">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80">
              <span className="mr-1">✨</span> New: Professional PDF Templates
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Invoice <span className="text-primary italic">Smarter</span>, <br />
              Get Paid Faster.
            </h1>
            <p className="mt-6 max-w-[42rem] text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              The modern invoicing platform for freelancers and small businesses. 
              Create, manage, and track professional invoices in seconds.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-sm">
                  Start Creating Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 px-8 text-base font-semibold"
                onClick={() => window.location.href = "/api/auth/google"}
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            </div>
          </div>

          {/* Mockup Image Placeholder */}
          <div className="mt-16 sm:mt-24">
            <div className="relative rounded-xl border border-border bg-card p-2 shadow-2xl lg:rounded-2xl lg:p-4">
              <div className="rounded-lg border border-border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-border" />
                    <div className="h-2.5 w-2.5 rounded-full bg-border" />
                    <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  </div>
                  <div className="h-4 w-32 rounded bg-border/50" />
                </div>
                <div className="p-6 sm:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-8 space-y-8">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3">
                          <div className="h-8 w-40 rounded bg-primary/10" />
                          <div className="h-4 w-60 rounded bg-muted" />
                        </div>
                        <div className="h-12 w-12 rounded bg-muted" />
                      </div>
                      <div className="space-y-4">
                         {[1,2,3].map(i => (
                           <div key={i} className="flex justify-between items-center py-4 border-b border-border last:border-0">
                              <div className="space-y-1.5">
                                <div className="h-4 w-32 rounded bg-foreground/10" />
                                <div className="h-3 w-20 rounded bg-muted" />
                              </div>
                              <div className="h-4 w-16 rounded bg-foreground/10" />
                           </div>
                         ))}
                      </div>
                    </div>
                    <div className="md:col-span-4 space-y-6">
                       <div className="rounded-lg border border-border bg-muted/30 p-5 space-y-4">
                          <div className="h-4 w-24 rounded bg-muted-foreground/20" />
                          <div className="h-10 w-full rounded bg-foreground/5" />
                          <div className="h-10 w-full rounded bg-primary" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t border-border bg-muted/30 py-24 sm:py-32">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Features</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to get paid.
              </p>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Focus on your work, not your paperwork. Our automated tools handle the details so you don't have to.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
                <Feature 
                  icon={<Zap className="h-5 w-5" />}
                  title="Fast Creation"
                  description="Generate professional invoices in under 60 seconds. Save items and clients for even faster workflows."
                />
                <Feature 
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Secure Storage"
                  description="Your data is encrypted and backed up daily. Never worry about losing an important document again."
                />
                <Feature 
                  icon={<Layers className="h-5 w-5" />}
                  title="Professional PDF"
                  description="Beautiful, modern PDF templates that look great on any device. Fully customizable with your brand."
                />
                <Feature 
                  icon={<Users className="h-5 w-5" />}
                  title="Client Management"
                  description="Keep all your client info in one place. Track their payment history and send automated reminders."
                />
                <Feature 
                  icon={<CreditCard className="h-5 w-5" />}
                  title="Payment Tracking"
                  description="See exactly who owes you money and when it's due. Monitor your cashflow with intuitive dashboards."
                />
                <Feature 
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  title="Developer API"
                  description="Integrate with your existing tools. Our robust API allows for custom workflows and automation."
                />
              </dl>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 sm:py-32">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Workflow</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Simple and efficient.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <Step 
                  number="01"
                  title="Setup Profile"
                  description="Add your business details, logo, and bank account info to get started in minutes."
                />
                <Step 
                  number="02"
                  title="Create & Send"
                  description="Choose a template, add your items, and send your invoice directly via email or link."
                />
                <Step 
                  number="03"
                  title="Track Payments"
                  description="Monitor your dashboard to see when invoices are viewed and get notified when payments arrive."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="border-t border-border bg-muted/30 py-24 sm:py-32">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Pay as you grow.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-2 lg:gap-8">
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8 shadow-sm xl:p-10">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold leading-8">Free</h3>
                  <p className="text-sm leading-6 text-muted-foreground">Perfect for freelancers just starting out.</p>
                  <p className="flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight">$0</span>
                    <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
                  </p>
                  <ul role="list" className="space-y-3 text-sm leading-6 text-muted-foreground pt-6">
                    <li className="flex gap-x-3">
                      <CheckCircle2 className="h-5 w-5 flex-none text-primary" /> Up to 5 invoices / month
                    </li>
                    <li className="flex gap-x-3">
                      <CheckCircle2 className="h-5 w-5 flex-none text-primary" /> Standard PDF template
                    </li>
                    <li className="flex gap-x-3">
                      <CheckCircle2 className="h-5 w-5 flex-none text-primary" /> Basic dashboard
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="mt-8">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </div>
              <div className="relative flex flex-col justify-between rounded-2xl border-2 border-primary bg-card p-8 shadow-md xl:p-10">
                <div className="absolute top-0 right-10 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  MOST POPULAR
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold leading-8 text-primary">Pro</h3>
                  <p className="text-sm leading-6 text-muted-foreground">For growing businesses needing more power.</p>
                  <p className="flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight">$12</span>
                    <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
                  </p>
                  <ul role="list" className="space-y-3 text-sm leading-6 text-muted-foreground pt-6">
                    <li className="flex gap-x-3">
                      <CheckCircle2 className="h-5 w-5 flex-none text-primary" /> Unlimited invoices
                    </li>
                    <li className="flex gap-x-3">
                      <CheckCircle2 className="h-5 w-5 flex-none text-primary" /> Premium templates
                    </li>
                    <li className="flex gap-x-3">
                      <CheckCircle2 className="h-5 w-5 flex-none text-primary" /> Detailed analytics
                    </li>
                    <li className="flex gap-x-3">
                      <CheckCircle2 className="h-5 w-5 flex-none text-primary" /> Priority support
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="mt-8">
                  <Button className="w-full">Start Free Trial</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto max-w-5xl py-24 sm:py-32">
          <div className="relative isolate overflow-hidden bg-primary px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to streamline your invoicing?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-primary-foreground/80">
              Join thousands of freelancers who trust InvoiceFlow for their business.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button variant="secondary" size="lg" className="font-semibold">
                  Get started for free
                </Button>
              </Link>
              <Link href="/login" className="text-sm font-semibold leading-6 text-primary-foreground">
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <FileText size={14} strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold tracking-tight">
                InvoiceFlow
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} InvoiceFlow Inc.
            </p>
            <div className="flex gap-4">
               {/* Icons could go here */}
               <div className="h-4 w-4 rounded bg-muted" />
               <div className="h-4 w-4 rounded bg-muted" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative space-y-3">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <dt className="text-lg font-bold">{title}</dt>
      <dd className="text-base leading-7 text-muted-foreground">{description}</dd>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative space-y-4">
      <div className="text-4xl font-black text-muted/50">{number}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
