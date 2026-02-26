import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileText,
  Layers,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

const highlights = [
  { label: "Invoices sent", value: "25k+" },
  { label: "Avg. creation time", value: "60 sec" },
  { label: "Freelancers & teams", value: "3k+" },
];

const features = [
  {
    icon: Zap,
    title: "Fast Invoice Creation",
    description:
      "Build polished invoices quickly with reusable items, saved clients, and smart totals.",
  },
  {
    icon: Layers,
    title: "Professional PDFs",
    description:
      "Generate clean, branded PDFs that are ready to send to clients instantly.",
  },
  {
    icon: CreditCard,
    title: "Payment Visibility",
    description:
      "Track pending and paid invoices in one place so your cash flow stays clear.",
  },
  {
    icon: Users,
    title: "Client Profiles",
    description:
      "Store client details once and reuse them whenever you create new invoices.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Default",
    description:
      "Keep your records protected and accessible whenever you need them.",
  },
  {
    icon: CheckCircle2,
    title: "Simple Workflow",
    description:
      "From draft to payment, each step is straightforward and optimized for speed.",
  },
];

const steps = [
  {
    number: "01",
    title: "Add your business details",
    description:
      "Set up your profile, logo, and bank details once for consistent invoices.",
  },
  {
    number: "02",
    title: "Create and send invoices",
    description:
      "Select client and items, generate the PDF, and share it in a few clicks.",
  },
  {
    number: "03",
    title: "Track invoice status",
    description:
      "Monitor what is paid, pending, or overdue and follow up at the right time.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              InvoiceFlow
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#workflow"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Workflow
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <Badge variant="secondary" className="mb-5">
                Built for freelancers and small teams
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Invoicing that feels easy and gets you paid faster.
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                Create professional invoices, send them quickly, and track
                payments with a clean workflow designed for daily use.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-11 px-6">
                  <Link href="/register">
                    Start for free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 px-6"
                >
                  <Link href="/api/auth/google">
                    <GoogleIcon className="h-4 w-4" />
                    Continue with Google
                  </Link>
                </Button>
              </div>

              <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border bg-card px-4 py-3"
                  >
                    <p className="text-xl font-semibold tracking-tight">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden border-border/80">
              <CardHeader className="border-b pb-5">
                <CardTitle className="text-base">Invoice Preview</CardTitle>
                <CardDescription>
                  See totals and status at a glance before sending.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  {[
                    "Website design",
                    "Monthly maintenance",
                    "SEO retainer",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{item}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty {index + 1}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        ₹{(index + 2) * 1800}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">₹16,200</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Ready to send as PDF
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="features" className="border-y bg-muted/30 py-16 sm:py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything needed to run invoicing smoothly
              </h2>
              <p className="mt-3 text-muted-foreground">
                A focused toolkit for creating invoices, keeping records, and
                staying on top of payments.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="gap-4">
                  <CardHeader className="pb-0">
                    <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <feature.icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Set up once, then invoice with confidence every time.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.number}>
                <CardHeader className="pb-3">
                  <p className="text-xs font-semibold tracking-wider text-primary">
                    STEP {step.number}
                  </p>
                  <CardTitle className="text-base">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Ready to simplify your invoicing?
                </h3>
                <p className="mt-2 text-sm text-primary-foreground/80 sm:text-base">
                  Join now and create your first professional invoice in
                  minutes.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/register">Create free account</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} InvoiceFlow</p>
          <p>Made for faster billing workflows</p>
        </div>
      </footer>
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
