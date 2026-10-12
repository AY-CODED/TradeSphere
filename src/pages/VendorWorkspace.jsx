import { ArrowDownRight, ArrowUpRight, Bell, ChevronDown, ChevronRight, Download, Grid2x2, LayoutGrid, Package, Search, ShieldCheck, ShoppingBag, TrendingUp, Truck, UserRound, Wallet, Warehouse } from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutGrid, active: true },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Products', icon: Package },
  { label: 'Analytics', icon: TrendingUp },
  { label: 'Customers', icon: UserRound },
  { label: 'Inventory', icon: Warehouse },
  { label: 'Reports', icon: Download },
];

const metrics = [
  { label: 'Total revenue', value: '$54,230.00', delta: '2.5%', trend: 'up', note: 'vs last month', accent: 'text-slate-900' },
  { label: 'Active orders', value: '142', delta: '8.2%', trend: 'up', note: 'vs last month', accent: 'text-slate-900' },
  { label: 'Avg completion', value: '4.2 days', delta: '0.5 days', trend: 'down', note: 'vs last month', accent: 'text-slate-900' },
  { label: 'Customer satisfaction', value: '98.2%', delta: '0.4%', trend: 'up', note: 'vs last month', accent: 'text-slate-900' },
];

const orderRows = [
  { id: 'ORD-8921', customer: 'Kwame Mensah', product: 'Premium Solar Kit', date: '2023-10-24', amount: '$450.00', status: 'Processing' },
  { id: 'ORD-8922', customer: 'Amara Okafor', product: 'Agricultural Pump', date: '2023-10-23', amount: '$1,200.00', status: 'Shipped' },
  { id: 'ORD-8923', customer: 'Zainab Bello', product: 'Battery Storage Unit', date: '2023-10-23', amount: '$890.00', status: 'Delivered' },
  { id: 'ORD-8924', customer: 'Kofi Asante', product: 'Grain Mill Model X', date: '2023-10-22', amount: '$2,150.00', status: 'Pending' },
  { id: 'ORD-8925', customer: 'Fatima Diop', product: 'Irrigation Sensors', date: '2023-10-22', amount: '$320.00', status: 'Delivered' },
];

const stockLegend = [
  { label: 'Electronics', value: '45%', color: 'bg-emerald-500' },
  { label: 'Agriculture', value: '30%', color: 'bg-orange-400' },
  { label: 'Logistics', value: '15%', color: 'bg-sky-400' },
  { label: 'Tools', value: '10%', color: 'bg-violet-400' },
];

const logisticsEntries = [
  { title: 'Customs Cleared', subtitle: 'Shipment LR-9021', time: '2 hours ago', status: 'done' },
  { title: 'Delayed Pickup', subtitle: 'Courier after 45 mins', time: '15 mins ago', status: 'warning' },
];

const chartBars = [32, 42, 48, 34, 60, 52, 65, 58, 62, 72, 75, 68];

const VendorWorkspace = () => (
  <div className="min-h-screen bg-[#edf1f4] px-4 py-6 md:px-6 lg:px-8">
    <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[20px] border border-slate-200 bg-[#f5f7fa] shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="flex min-h-[980px] flex-col lg:flex-row">
        <aside className="w-full bg-[#0f2335] px-5 py-5 text-slate-200 lg:w-[220px] lg:shrink-0">
          <div className="flex items-center gap-3 border-b border-slate-700 pb-5">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-[#183852] text-sm font-black text-white">T</div>
            <div className="text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Vendor workspace</p>
            </div>
          </div>

          <nav aria-label="Vendor workspace navigation" className="mt-6 space-y-1.5">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${active ? 'bg-emerald-600 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 space-y-1.5 border-t border-slate-700 pt-5 text-sm">
            <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
              <ShieldCheck className="h-4 w-4" />
              Settings
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
              <Wallet className="h-4 w-4" />
              Support
            </button>
            <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-300 transition hover:bg-slate-800/70 hover:text-white">
              <ArrowDownRight className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <div className="flex-1 bg-[#f4f7f9]">
          <header className="flex flex-col gap-4 border-b border-slate-200 bg-[#f8fafb] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="relative w-full max-w-[420px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                aria-label="Search products, vendors, or services"
                value=""
                readOnly
                placeholder="Search products, vendors, or services..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900">
                <Bell className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-xs font-bold text-white">JD</div>
                <div className="hidden text-left sm:block">
                  <p className="text-[11px] font-semibold text-slate-900">John Doe</p>
                  <p className="text-[10px] text-slate-500">Supplier</p>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 pb-7 pt-6 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Overview</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Overview</h1>
                <p className="mt-1 text-sm text-slate-500">Monitor your performance and manage high-priority orders.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <Download className="h-4 w-4" />
                  Export Data
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                  <Grid2x2 className="h-4 w-4" />
                  Add New Product
                </button>
              </div>
            </div>

            <section className="mt-6 grid gap-4 xl:grid-cols-4">
              {metrics.map(({ label, value, delta, trend, note }) => (
                <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {delta}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{note}</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Revenue Trends</h2>
                    <p className="mt-1 text-sm text-slate-500">Monthly sales performance vs target.</p>
                  </div>
                  <button type="button" className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    H1 2023
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-[#eef7f4] p-3">
                  <svg viewBox="0 0 620 220" className="h-52 w-full" preserveAspectRatio="none" aria-label="Revenue chart">
                    <defs>
                      <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#4ade80" stopOpacity="0.04" />
                      </linearGradient>
                    </defs>
                    {[0, 1, 2, 3, 4].map((line) => (
                      <line key={line} x1="0" y1={30 + line * 42} x2="620" y2={30 + line * 42} stroke="#dfe7ec" strokeDasharray="4 8" />
                    ))}
                    <path d="M0 146 C50 110, 70 122, 120 98 S200 76, 240 92 S310 110, 380 70 S470 48, 520 88 S590 124, 620 72 L620 210 L0 210 Z" fill="url(#chartFill)" />
                    <path d="M0 146 C50 110, 70 122, 120 98 S200 76, 240 92 S310 110, 380 70 S470 48, 520 88 S590 124, 620 72" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, index) => (
                      <text key={label} x={90 + index * 90} y="205" fill="#6b7280" fontSize="11" textAnchor="middle">{label}</text>
                    ))}
                  </svg>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Featured showcase</p>
                    <h2 className="mt-2 text-lg font-bold text-slate-900">Industrial Grade Generator X200</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Trending</span>
                </div>

                <div className="mt-4 overflow-hidden rounded-[18px] bg-[#e9ecef] p-5">
                  <div className="relative mx-auto h-40 w-full max-w-[240px] rounded-[18px] bg-gradient-to-b from-slate-200 to-slate-400">
                    <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[10px] border-slate-100 bg-slate-200/90" />
                    <div className="absolute left-1/2 top-1/2 h-16 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[40px] border border-slate-300 bg-slate-100" />
                    <div className="absolute left-[50%] top-[18%] h-7 w-7 -translate-x-1/2 rounded-full bg-slate-200" />
                    <div className="absolute left-[28%] top-[54%] h-14 w-14 rounded-full border-[8px] border-slate-300 bg-slate-100" />
                    <div className="absolute right-[28%] top-[54%] h-14 w-14 rounded-full border-[8px] border-slate-300 bg-slate-100" />
                    <div className="absolute left-1/2 top-[62%] h-12 w-16 -translate-x-1/2 rounded-[16px] border border-slate-300 bg-slate-100" />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm leading-6 text-slate-600">High-efficiency diesel generator designed for rugged industrial and commercial trade applications.</p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Unit price</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">$1,249.00</p>
                  </div>
                  <button type="button" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                    Manage Listing
                  </button>
                </div>
              </article>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
                    <p className="mt-1 text-sm text-slate-500">Manage and track your latest customer orders.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative hidden sm:block">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                      <input aria-label="Search order IDs" placeholder="Search ID or customer..." className="h-9 w-44 rounded-lg border border-slate-200 bg-slate-50 pl-9 text-xs text-slate-700 outline-none placeholder:text-slate-400" />
                    </div>
                    <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                      Filter
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                      {orderRows.map(({ id, customer, product, date, amount, status }) => (
                        <tr key={id}>
                          <td className="px-4 py-3 font-semibold text-slate-900">{id}</td>
                          <td className="px-4 py-3">{customer}</td>
                          <td className="px-4 py-3">{product}</td>
                          <td className="px-4 py-3">{date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{amount}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${status === 'Processing' ? 'bg-orange-50 text-orange-700' : status === 'Shipped' ? 'bg-sky-50 text-sky-700' : status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button type="button" aria-label={`More actions for ${id}`} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Showing 5 of 124 orders</span>
                  <button type="button" className="font-semibold text-emerald-700 hover:text-emerald-800">View Full Order History</button>
                </div>
              </article>

              <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Inventory Distribution</h2>
                    <p className="mt-1 text-sm text-slate-500">Current stock mix across categories.</p>
                  </div>
                  <button type="button" className="text-xs font-semibold text-emerald-700">View Schedule</button>
                </div>

                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative grid h-40 w-40 place-items-center rounded-full bg-[conic-gradient(#10b981_0_45%,#f59e0b_45%_75%,#38bdf8_75%_90%,#a78bfa_90%_100%)]">
                    <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center shadow-inner">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Total</p>
                        <p className="mt-1 text-3xl font-bold text-slate-900">450</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full space-y-3 text-sm text-slate-700">
                    {stockLegend.map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                          <span>{label}</span>
                        </div>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Logistics Queue</h2>
                  <p className="mt-1 text-sm text-slate-500">Track shipment and delivery stages.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  85% complete
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {logisticsEntries.map(({ title, subtitle, time, status }) => (
                  <div key={title} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full ${status === 'done' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {status === 'done' ? <CheckCircleIcon /> : <AlertIcon />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">{title}</p>
                        <span className="text-[11px] text-slate-500">{time}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <footer className="border-t border-slate-200 bg-[#f8fafb] px-4 py-6 text-sm text-slate-500 md:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-[#0f2335] text-xs font-bold text-white">T</div>
                <div>
                  <p className="font-semibold text-slate-700">Secure vendor ecosystem</p>
                  <p className="text-xs text-slate-500">Empowering the next generation of trade and commerce.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Security</span>
                <span>Contact Support</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
  </svg>
);

export default VendorWorkspace;
