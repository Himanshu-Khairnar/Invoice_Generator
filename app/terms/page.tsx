import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
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
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4">Terms and Conditions</h1>
                    <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

                    <div className="space-y-8 text-foreground/90 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold mb-3 text-foreground">1. Introduction</h2>
                            <p>Welcome to BillPartner. By using our service, you agree to these terms. Please read them carefully. BillPartner provides an invoice generation and management service designed to help freelancers and small businesses.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-3 text-foreground">2. User Accounts</h2>
                            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-3 text-foreground">3. Service Usage</h2>
                            <p>You agree to use the service only for lawful purposes. You are responsible for any invoices created and sent through our platform. We reserve the right to refuse service, terminate accounts, or remove content in our sole discretion.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-3 text-foreground">4. Intellectual Property</h2>
                            <p>The service and its original content, features, and functionality are and will remain the exclusive property of BillPartner and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-3 text-foreground">5. Changes to Terms</h2>
                            <p>We reserve the right to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
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
                        <Link href="https://github.com" className="hover:text-foreground transition-colors">GitHub</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
