import { AlertTriangle, ArrowDown, ArrowRight, Bell, ChevronDown, ChevronLeft, ChevronRight, Download, FileText, Filter, Search, ShieldCheck, ShieldAlert, ShoppingBag, Sparkles, TrendingUp, UserCheck } from 'lucide-react';

const stats = [
  { label: 'Open cases', value: '24', tone: 'emerald', icon: ShieldCheck },
  { label: 'Under review', value: '12', tone: 'slate', icon: FileText },
  { label: 'Awaiting evidence', value: '8', tone: 'amber', icon: AlertTriangle },
  { label: 'Resolved (300)', value: '142', tone: 'red', icon: ShoppingBag },
];

const disputes = [
  { id: 'DSP-2201', order: 'ORD-8921', stakeholder: 'Abeke Bikila', issue: 'Damaged on Arrival', amount: '$1,240.00', priority: 'High', status: 'Under review', age: '2h ago' },
  { id: 'DSP-2202', order: 'ORD-8922', stakeholder: 'Sarah Johnson', issue: 'Wrong Item Sent', amount: '$450.50', priority: 'Medium', status: 'Open', age: '1d ago' },
  { id: 'DSP-2203', order: 'ORD-8923', stakeholder: 'Kofi Mensah', issue: 'Package Not Received', amount: '$2,100.00', priority: 'High', status: 'Awaiting evidence', age: '4d ago' },
  { id: 'DSP-2204', order: 'ORD-8924', stakeholder: 'Fatima Zarah', issue: 'Incomplete Order', amount: '$890.00', priority: 'Low', status: 'Resolved', age: '3d ago' },
  { id: 'DSP-2205', order: 'ORD-8925', stakeholder: 'David Omondi', issue: 'Quality Dispute', amount: '$120.25', priority: 'Medium', status: 'Under review', age: '1h ago' },
];

const navItems = [
  { label: 'Overview', icon: Sparkles },
  { label: 'Disputes', icon: AlertTriangle, active: true },
  { label: 'Stakeholders', icon: UserCheck },
  { label: 'Inventory', icon: ShoppingBag },
  { label: 'Logistics', icon: TrendingUp },
  { label: 'Analytics', icon: TrendingUp },
  { label: 'Compliance', icon: ShieldCheck },
  { label: 'Fraud Monitoring', icon: ShieldAlert },
  { label: 'Configuration', icon: FileText },
];

const AdminDisputes = () => (
  <div className="min-h-screen bg-[#edf2f5] px-4 py-5 text-slate-900 sm:px-6">
    <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[20px] border border-slate-200 bg-[#f7f9fb] shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-[#f9fafb] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-[#0d2136] text-sm font-black text-white">T</div>
          <div className="relative hidden w-[320px] sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              aria-label="Search products, vendors, or services"
              placeholder="Search products, vendors, or services..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-[#eaf4ee] pl-10 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
          <a href="/marketplace" className="transition hover:text-emerald-800">Marketplace</a>
          <a href="/account?section=My%20orders" className="transition hover:text-emerald-800">Logistics</a>
          <a href="/support" className="transition hover:text-emerald-800">Support</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"><Bell className="h-4 w-4" /></button>
          <button type="button" className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"><Download className="h-4 w-4" /></button>
          <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900">Sign in</button>
        </div>
      </header>

      <div className="flex min-h-[840px] flex-col lg:flex-row">
        <aside className="w-full bg-[#0d2136] px-4 py-5 text-slate-200 lg:w-[230px] lg:shrink-0">
          <div className="flex items-center gap-3 px-2 pb-4">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-[#18314d] text-sm font-black text-white">T</div>
            <div>
              <p className="text-sm font-bold text-white">TradeSphere</p>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${active ? 'bg-emerald-600 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'text-slate-300 hover:bg-[#18314d] hover:text-white'}`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-slate-700 bg-[#112a40] p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#1d3e5b] text-xs font-bold text-emerald-300">MA</div>
              <div>
                <p className="text-sm font-semibold text-white">Marcus Aurelius</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Dispute Arbitrator</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-[#f3f6fb] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Disputes</h1>
              <p className="mt-1 text-sm text-slate-500">Mediate conflicts and ensure marketplace integrity.</p>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900">
                <Download className="h-4 w-4" />
                Export Audit Log
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                <TrendingUp className="h-4 w-4" />
                Performance Metrics
              </button>
            </div>
          </div>

          <section className="mt-6 grid gap-4 md:grid-cols-4">
            {stats.map(({ label, value, tone, icon: Icon }) => (
              <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className={`grid h-9 w-9 place-items-center rounded-xl ${tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : tone === 'slate' ? 'bg-slate-100 text-slate-600' : tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                  </div>
                  <div className="rounded-full bg-slate-100 p-1 text-slate-500">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-[20px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="relative w-full max-w-[320px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  aria-label="Search case ID or stakeholder"
                  placeholder="Search case ID, order, stakeholder..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-900">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-900">
                  All Cases
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-[#f8fafb] text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Case ID</th>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Stakeholder</th>
                    <th className="px-4 py-3">Issue / Reason</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {disputes.map(({ id, order, stakeholder, issue, amount, priority, status, age }) => (
                    <tr key={id}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{id}</td>
                      <td className="px-4 py-3">{order}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-semibold text-slate-900">{stakeholder}</div>
                          <div className="text-[11px] text-slate-500">{age}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{issue}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${priority === 'High' ? 'bg-rose-100 text-rose-700' : priority === 'Medium' ? 'bg-amber-100 text-amber-700' : priority === 'Low' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'}`}>
                          {priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${status === 'Under review' ? 'bg-violet-100 text-violet-700' : status === 'Open' ? 'bg-amber-100 text-amber-700' : status === 'Awaiting evidence' ? 'bg-orange-100 text-orange-700' : status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                          {status === 'Resolved' ? 'View' : 'Review'}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-[#fafbfc] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-slate-500">Showing 5 of 24 active disputes</p>
              <div className="flex items-center gap-2">
                <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-900">
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-900">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
);

export default AdminDisputes;
