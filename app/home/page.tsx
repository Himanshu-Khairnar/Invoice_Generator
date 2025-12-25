import Link from "next/link";

const invoices = [
  { client: "Aster Studio", amount: "$1,240", status: "Paid", due: "Dec 12" },
  { client: "Northwind Co.", amount: "$980", status: "Pending", due: "Dec 18" },
  { client: "Brightpath Labs", amount: "$2,310", status: "Overdue", due: "Dec 05" },
  { client: "Horizon Media", amount: "$640", status: "Paid", due: "Dec 08" },
];

const stats = [
  { label: "Total sent", value: "$24,380", change: "+18%" },
  { label: "Pending", value: "$9,620", change: "-2%" },
  { label: "Overdue", value: "$2,340", change: "+4%" },
];

const shortcuts = [
  { label: "Create invoice", href: "/invoice/new" },
  { label: "Add client", href: "/clients/new" },
  { label: "Add item", href: "/items/new" },
  { label: "Bank details", href: "/settings/bank" },
];

function statusColor(status: string) {
  if (status === "Paid") return "text-emerald-300";
  if (status === "Overdue") return "text-rose-300";
  return "text-amber-300";
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <div className="h-9 w-9 rounded-xl bg-emerald-400/20 ring-1 ring-emerald-200/50" />
            <span className="text-emerald-200">InvoiceFlow</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              className="rounded-full px-4 py-2 font-medium text-slate-200 transition hover:text-emerald-200"
            >
              Landing
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-4 py-2 font-semibold text-emerald-100 transition hover:border-emerald-200/60"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8">
        <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/15 via-black to-emerald-400/10 p-8 shadow-2xl shadow-emerald-500/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Home</p>
              <h1 className="text-3xl font-semibold text-slate-50">Good afternoon, here is your billing pulse.</h1>
              <p className="text-slate-200/80">
                Track sent invoices, monitor payments, and jump into the actions you use most.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/invoice/new"
                className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:-translate-y-[1px] hover:bg-emerald-300"
              >
                Create invoice
              </Link>
              <Link
                href="/settings/bank"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200/60"
              >
                Update bank details
              </Link>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-black/40 p-4 shadow-lg shadow-emerald-500/10"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-200/70">{stat.label}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-2xl font-semibold text-slate-50">{stat.value}</p>
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-200/50">
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-6 shadow-xl shadow-emerald-500/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-50">Recent invoices</h2>
              <Link className="text-sm font-semibold text-emerald-100 hover:text-emerald-200" href="/invoice">
                View all
              </Link>
            </div>
            <div className="mt-4 divide-y divide-white/5">
              {invoices.map((invoice) => (
                <div
                  key={invoice.client}
                  className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-50">{invoice.client}</p>
                    <p className="text-xs text-slate-200/70">Due {invoice.due}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <span className={statusColor(invoice.status)}>{invoice.status}</span>
                    <span className="text-slate-100">{invoice.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-2xl border border-white/10 bg-black/60 p-6 shadow-lg shadow-emerald-500/10">
              <h3 className="text-lg font-semibold text-slate-50">Quick actions</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {shortcuts.map((shortcut) => (
                  <Link
                    key={shortcut.label}
                    href={shortcut.href}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:-translate-y-[1px] hover:border-emerald-200/60"
                  >
                    {shortcut.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/15 via-black to-emerald-400/10 p-6 shadow-lg shadow-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Keep your bank details current</p>
                  <p className="text-xs text-slate-200/70">
                    Ensure payouts go to the right account before sending your next invoice.
                  </p>
                </div>
                <Link
                  href="/settings/bank"
                  className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/30 transition hover:-translate-y-[1px] hover:bg-emerald-300"
                >
                  Update
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/50 p-6 shadow-lg shadow-emerald-500/10">
              <h3 className="text-lg font-semibold text-slate-50">Tips</h3>
              <ul className="mt-3 space-y-3 text-sm text-slate-200/80">
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">Use saved items for faster invoice creation.</li>
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">Attach your logo in settings for branded PDFs.</li>
                <li className="rounded-lg border border-white/10 bg-white/5 p-3">Send reminders for pending invoices after 7 days.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
