import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
    return (
        <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/20">

            {/* ─── Background ─── */}
            <div className="fixed inset-0 -z-20 bg-background" />
            <div className="fixed inset-0 -z-10 [background-image:radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
            <div className="absolute top-[-8%] left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[700px] rounded-full bg-primary/25 blur-[140px] opacity-60 pointer-events-none" />

            {/* ─── Navbar ─── */}
            <header className="fixed top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-2xl">
                <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <img src="/invoice-logo.svg" alt="BillPartner" className="h-7 w-7" />
                        <span className="font-bold tracking-tight text-foreground text-[15px]">BillPartner</span>
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

            <main className="flex-1 pt-24 pb-20 container mx-auto max-w-4xl px-4 sm:px-6">
                <div className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/5 p-8 md:p-12">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

                    <div className="space-y-8 text-foreground/90 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold mb-3 text-foreground">1. Data Collection</h2>
                            <p>We collect information you provide directly to us, such as when you create an account, fill out your business profile, and create invoices. This includes your name, email address, business details, and client information necessary for invoicing.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-3 text-foreground">2. How We Use Your Data</h2>
                            <p>We use the information we collect primarily to provide, maintain, and improve our services. Specifically, your data is used to generate PDFs, track your invoice statuses, and keep your business records organized. We do not sell your personal information to third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-3 text-foreground">3. Data Security</h2>
                            <p>We implement a variety of security measures to maintain the safety of your personal information. Your data is encrypted in transit and at rest. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-3 text-foreground">4. Cookies and Tracking</h2>
                            <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-3 text-foreground">5. Your Rights</h2>
                            <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights, including the right to access, update, or delete the information we have on you. Please contact us if you wish to exercise these rights.</p>
                        </section>
                    </div>
                </div>
            </main>

            {/* ─── Footer ─── */}
            <footer className="border-t border-border/20 bg-background py-10 mt-auto">
                <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 sm:flex-row sm:px-6 text-sm">
                    <div className="flex items-center gap-2">
                        <img src="/invoice-logo.svg" alt="BillPartner" className="h-5 w-5" />
                        <span className="font-bold tracking-tight text-foreground">BillPartner</span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                        © {new Date().getFullYear()} BillPartner. All rights reserved.
                    </p>
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
