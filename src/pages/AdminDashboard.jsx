import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Download,
  FileCheck2,
  Filter,
  History,
  LayoutDashboard,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Store,
  UsersRound,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/auth/LogoutButton';
import { useAuth } from '../hooks/useAuth';

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'disputes', label: 'Disputes', icon: AlertTriangle, badge: '24' },
  { id: 'accounts', label: 'Users & vendors', icon: UsersRound },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'compliance', label: 'Compliance', icon: ShieldCheck, badge: '8' },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

const sectionDetails = {
  overview: {
    title: 'Platform overview',
    description: 'A live-looking snapshot of marketplace activity. All figures are sample data.',
  },
  disputes: {
    title: 'Disputes',
    description: 'Review buyer and vendor cases and keep marketplace resolutions moving.',
  },
  accounts: {
    title: 'Users & vendors',
    description: 'Review marketplace accounts, verification and account status.',
  },
  'vendor-history': {
    title: 'Vendor account history',
    description: 'Review account changes and activity recorded for this vendor.',
  },
  orders: {
    title: 'Orders',
    description: 'Monitor recent marketplace orders, payments and fulfilment.',
  },
  analytics: {
    title: 'Analytics',
    description: 'Explore sample platform performance across the last seven days.',
  },
  compliance: {
    title: 'Compliance',
    description: 'Review business verification submissions and risk flags.',
  },
  settings: {
    title: 'Settings',
    description: 'Manage the preferences shown in this admin demo.',
  },
};

const demoTables = {
  disputes: {
    columns: [
      ['id', 'Case ID'],
      ['order', 'Order'],
      ['party', 'Stakeholder'],
      ['reason', 'Issue'],
      ['amount', 'Amount'],
      ['priority', 'Priority'],
      ['status', 'Status'],
      ['updated', 'Updated'],
    ],
    rows: [
      { id: 'DSP-2201', order: 'ORD-8921', party: 'Abeke Bikila', reason: 'Damaged on arrival', amount: '$1,240.00', priority: 'High', status: 'Under review', updated: '2h ago' },
      { id: 'DSP-2202', order: 'ORD-8922', party: 'Sarah Johnson', reason: 'Wrong item sent', amount: '$450.50', priority: 'Medium', status: 'Open', updated: '1d ago' },
      { id: 'DSP-2203', order: 'ORD-8923', party: 'Kofi Mensah', reason: 'Package not received', amount: '$2,100.00', priority: 'High', status: 'Awaiting evidence', updated: '4d ago' },
      { id: 'DSP-2204', order: 'ORD-8924', party: 'Fatima Zarah', reason: 'Incomplete order', amount: '$890.00', priority: 'Low', status: 'Resolved', updated: '3d ago' },
      { id: 'DSP-2205', order: 'ORD-8925', party: 'David Omondi', reason: 'Quality dispute', amount: '$120.25', priority: 'Medium', status: 'Under review', updated: '1h ago' },
      { id: 'DSP-2206', order: 'ORD-8926', party: 'Amina Yusuf', reason: 'Refund not received', amount: '$310.00', priority: 'Low', status: 'Open', updated: '5h ago' },
    ],
  },
  accounts: {
    columns: [
      ['name', 'Name'],
      ['type', 'Account type'],
      ['email', 'Account handle'],
      ['joined', 'Joined'],
      ['verification', 'Verification'],
      ['status', 'Status'],
    ],
    rows: [
      { name: 'Abeke Bikila', type: 'Buyer', email: 'abeke •••• (Protected)', joined: 'Oct 10, 2026', verification: 'Verified', status: 'Active' },
      { name: 'Kofi Mensah', type: 'Vendor', email: 'kofi •••• (Accra Trade)', joined: 'Oct 08, 2026', verification: 'In review', status: 'Active' },
      { name: 'Sarah Johnson', type: 'Buyer', email: 'sarah •••• (Protected)', joined: 'Oct 06, 2026', verification: 'Verified', status: 'Active' },
      { name: 'Amina Yusuf', type: 'Vendor', email: 'amina •••• (Northstar)', joined: 'Oct 04, 2026', verification: 'Action needed', status: 'Pending' },
      { name: 'David Omondi', type: 'Buyer', email: 'david •••• (Protected)', joined: 'Oct 01, 2026', verification: 'Not required', status: 'Restricted' },
      { name: 'Fatima Zarah', type: 'Vendor', email: 'fatima •••• (Zarah Export)', joined: 'Sep 28, 2026', verification: 'Verified', status: 'Active' },
    ],
  },
  orders: {
    columns: [
      ['id', 'Order ID'],
      ['buyer', 'Buyer'],
      ['vendor', 'Vendor'],
      ['date', 'Date'],
      ['total', 'Total'],
      ['payment', 'Payment'],
      ['status', 'Fulfilment'],
    ],
    rows: [
      { id: 'ORD-8926', buyer: 'Amina Yusuf', vendor: 'Greenfield Produce', date: 'Oct 13, 2026', total: '$2,450.00', payment: 'Paid', status: 'Processing' },
      { id: 'ORD-8925', buyer: 'David Omondi', vendor: 'Accra Trade Co.', date: 'Oct 13, 2026', total: '$120.25', payment: 'Held', status: 'Disputed' },
      { id: 'ORD-8924', buyer: 'Fatima Zarah', vendor: 'Northstar Textiles', date: 'Oct 12, 2026', total: '$890.00', payment: 'Paid', status: 'Delivered' },
      { id: 'ORD-8923', buyer: 'Kofi Mensah', vendor: 'Lakeside Electronics', date: 'Oct 11, 2026', total: '$2,100.00', payment: 'Paid', status: 'In transit' },
      { id: 'ORD-8922', buyer: 'Sarah Johnson', vendor: 'Zarah Exports', date: 'Oct 10, 2026', total: '$450.50', payment: 'Refunded', status: 'Cancelled' },
    ],
  },
  compliance: {
    columns: [
      ['id', 'Review ID'],
      ['business', 'Business'],
      ['category', 'Review type'],
      ['submitted', 'Submitted'],
      ['risk', 'Risk level'],
      ['status', 'Status'],
    ],
    rows: [
      { id: 'VER-1048', business: 'Northstar Textiles', category: 'Business identity', submitted: 'Oct 13, 2026', risk: 'Low', status: 'In review' },
      { id: 'VER-1047', business: 'Amina Imports', category: 'Payout details', submitted: 'Oct 12, 2026', risk: 'High', status: 'Action needed' },
      { id: 'VER-1046', business: 'Accra Trade Co.', category: 'Business identity', submitted: 'Oct 11, 2026', risk: 'Medium', status: 'In review' },
      { id: 'VER-1045', business: 'Zarah Exports', category: 'Tax documentation', submitted: 'Oct 10, 2026', risk: 'Low', status: 'Approved' },
      { id: 'VER-1044', business: 'Lakeside Electronics', category: 'Business identity', submitted: 'Oct 09, 2026', risk: 'Medium', status: 'Action needed' },
    ],
  },
};

const vendorHistory = {
  'kofi-mensah': {
    name: 'Kofi Mensah',
    business: 'Accra Trade Co.',
    email: 'kofi •••• (Verified Vendor)',
    status: 'Active',
    verification: 'In review',
    events: [
      { date: 'Oct 13, 2026 · 2:14 PM', action: 'Updated business profile', detail: 'Changed business contact information.', source: 'Vendor workspace' },
      { date: 'Oct 12, 2026 · 9:42 AM', action: 'Submitted verification documents', detail: 'Business identity documents submitted for review.', source: 'Compliance' },
      { date: 'Oct 11, 2026 · 4:08 PM', action: 'Added product listing', detail: 'Industrial grain milling equipment · SKU ACC-204.', source: 'Product catalogue' },
      { date: 'Oct 08, 2026 · 11:20 AM', action: 'Vendor account created', detail: 'Vendor registration completed.', source: 'Platform' },
    ],
  },
  'amina-yusuf': {
    name: 'Amina Yusuf',
    business: 'Amina Imports',
    email: 'amina •••• (Pending Verification)',
    status: 'Pending',
    verification: 'Action needed',
    events: [
      { date: 'Oct 13, 2026 · 10:15 AM', action: 'Updated payout details', detail: 'Submitted new payout account information.', source: 'Vendor workspace' },
      { date: 'Oct 12, 2026 · 3:30 PM', action: 'Verification needs attention', detail: 'Additional business documentation requested.', source: 'Compliance' },
      { date: 'Oct 10, 2026 · 8:54 AM', action: 'Created first product draft', detail: 'Organic shea butter · draft not published.', source: 'Product catalogue' },
      { date: 'Oct 04, 2026 · 1:05 PM', action: 'Vendor account created', detail: 'Vendor registration completed.', source: 'Platform' },
    ],
  },
  'fatima-zarah': {
    name: 'Fatima Zarah',
    business: 'Zarah Exports',
    email: 'fatima •••• (Verified Vendor)',
    status: 'Active',
    verification: 'Verified',
    events: [
      { date: 'Oct 13, 2026 · 9:18 AM', action: 'Fulfilled order ORD-8924', detail: 'Order marked delivered to the buyer.', source: 'Vendor workspace' },
      { date: 'Oct 12, 2026 · 12:02 PM', action: 'Added product listing', detail: 'Export-grade cotton fabric · SKU ZAR-118.', source: 'Product catalogue' },
      { date: 'Oct 10, 2026 · 5:41 PM', action: 'Business verification approved', detail: 'Business identity and tax documents verified.', source: 'Compliance' },
      { date: 'Sep 28, 2026 · 10:12 AM', action: 'Vendor account created', detail: 'Vendor registration completed.', source: 'Platform' },
    ],
  },
};

const metrics = [
  { label: 'Gross merchandise value', value: '$284,590', change: '+12.8%', icon: CircleDollarSign, tone: 'emerald' },
  { label: 'Marketplace orders', value: '1,284', change: '+8.2%', icon: ShoppingBag, tone: 'blue' },
  { label: 'Active accounts', value: '8,492', change: '+4.6%', icon: UsersRound, tone: 'violet' },
  { label: 'Open disputes', value: '24', change: '-2.4%', icon: AlertTriangle, tone: 'amber' },
];

const weeklyActivity = [
  { day: 'Mon', value: 46 },
  { day: 'Tue', value: 68 },
  { day: 'Wed', value: 56 },
  { day: 'Thu', value: 82 },
  { day: 'Fri', value: 62 },
  { day: 'Sat', value: 94 },
  { day: 'Sun', value: 72 },
];

const recentActivity = [
  { icon: Store, title: 'New vendor registration', detail: 'Northstar Textiles submitted its profile', time: '12 min ago', tone: 'emerald' },
  { icon: AlertTriangle, title: 'Dispute needs attention', detail: 'DSP-2203 is awaiting evidence', time: '38 min ago', tone: 'amber' },
  { icon: BadgeCheck, title: 'Verification completed', detail: 'Zarah Exports was approved', time: '1 hr ago', tone: 'blue' },
  { icon: ShoppingBag, title: 'Order placed', detail: 'ORD-8926 · $2,450.00', time: '2 hrs ago', tone: 'violet' },
];

const statusClassName = (value) => {
  const status = value.toLowerCase();
  if (status.includes('resolved') || status.includes('approved') || status === 'active' || status === 'paid' || status === 'verified' || status === 'delivered') {
    return 'bg-emerald-50 text-emerald-700';
  }
  if (status.includes('review') || status.includes('processing') || status.includes('medium') || status.includes('held') || status.includes('pending')) {
    return 'bg-amber-50 text-amber-700';
  }
  if (status.includes('awaiting') || status.includes('action') || status.includes('high') || status.includes('disputed') || status.includes('restricted')) {
    return 'bg-rose-50 text-rose-700';
  }
  if (status.includes('low') || status.includes('transit')) {
    return 'bg-sky-50 text-sky-700';
  }
  return 'bg-slate-100 text-slate-700';
};

const escapeCsvValue = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [notice, setNotice] = useState('');
  const [settings, setSettings] = useState({ disputeAlerts: true, vendorReview: true, weeklyReport: false });

  const routeParts = location.pathname.split('/').filter(Boolean);
  const vendorId = routeParts[1] === 'vendors' ? routeParts[2] : '';
  const selectedVendor = vendorHistory[vendorId] || null;
  const routeSection = routeParts[1] || 'overview';
  const activeSection = vendorId ? 'vendor-history' : sectionDetails[routeSection] ? routeSection : 'overview';
  const details = activeSection === 'vendor-history'
    ? { title: selectedVendor?.business || 'Vendor history', description: selectedVendor ? `Account activity and history for ${selectedVendor.name}.` : 'No sample account history is available for this vendor.' }
    : sectionDetails[activeSection];
  const table = demoTables[activeSection];
  const rawAdminName = user?.fullName || user?.name || user?.email || 'Platform administrator';
  const adminName = rawAdminName.includes('@') ? rawAdminName.split('@')[0] : rawAdminName;
  const adminInitials = adminName.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  const statusOptions = useMemo(() => (
    table ? ['All statuses', ...new Set(table.rows.map((row) => row.status))] : ['All statuses']
  ), [table]);

  const filteredRows = useMemo(() => {
    if (!table) return [];
    const normalizedSearch = search.trim().toLowerCase();
    return table.rows.filter((row) => {
      const matchesSearch = !normalizedSearch || Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedSearch));
      const matchesStatus = statusFilter === 'All statuses' || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, table]);

  const selectSection = (section) => {
    setSearch('');
    setStatusFilter('All statuses');
    setNotice('');
    navigate(section === 'overview' ? '/admin' : `/admin/${section}`);
  };

  const exportRows = () => {
    if (!table || filteredRows.length === 0) {
      setNotice('There are no matching rows to export.');
      return;
    }

    const csv = [
      table.columns.map(([, label]) => escapeCsvValue(label)).join(','),
      ...filteredRows.map((row) => table.columns.map(([key]) => escapeCsvValue(row[key])).join(',')),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `tradesphere-${activeSection}-demo.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setNotice('A CSV export of the visible demo data has been downloaded.');
  };

  const handleDemoAction = (action) => {
    setNotice(`${action} is a demo action. No account or marketplace data was changed.`);
  };

  const renderOverview = () => (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Platform metrics">
        {metrics.map(({ label, value, change, icon: Icon, tone }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : tone === 'blue' ? 'bg-sky-50 text-sky-700' : tone === 'violet' ? 'bg-violet-50 text-violet-700' : 'bg-amber-50 text-amber-700'}`}>
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${change.startsWith('-') ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'}`}>
                {change.startsWith('-') ? <ArrowDownRight aria-hidden="true" className="h-3.5 w-3.5" /> : <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />}
                {change}
              </span>
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-400">Compared with previous 7 days</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Marketplace activity</h2>
              <p className="mt-1 text-sm text-slate-500">Weekly order volume · sample data</p>
            </div>
            <button type="button" onClick={() => selectSection('analytics')} className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-800 hover:text-emerald-900">
              View analytics <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-7 flex h-52 items-end justify-between gap-3 border-b border-slate-100 px-1">
            {weeklyActivity.map(({ day, value }) => (
              <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] font-semibold text-slate-400">{value}</span>
                <div
                  aria-label={`${day}: ${value} orders`}
                  className={`w-full max-w-10 rounded-t-lg ${day === 'Sat' ? 'bg-emerald-700' : 'bg-emerald-200'}`}
                  style={{ height: `${value}%` }}
                />
                <span className="mb-2 text-xs font-medium text-slate-500">{day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
            Orders placed
            <span className="ml-auto">Peak day: Saturday</span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent activity</h2>
              <p className="mt-1 text-sm text-slate-500">Latest platform events</p>
            </div>
            <Activity aria-hidden="true" className="h-5 w-5 text-slate-400" />
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {recentActivity.map(({ icon: Icon, title, detail, time, tone }) => (
              <li key={title} className="flex gap-3 py-3.5">
                <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : tone === 'amber' ? 'bg-amber-50 text-amber-700' : tone === 'blue' ? 'bg-sky-50 text-sky-700' : 'bg-violet-50 text-violet-700'}`}>
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{detail}</p>
                </div>
                <span className="shrink-0 pt-1 text-[11px] text-slate-400">{time}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Needs your attention</h2>
            <p className="mt-1 text-sm text-slate-500">Items that may need an administrator review</p>
          </div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">32 open items</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Disputes awaiting review', value: '12', icon: AlertTriangle, destination: 'disputes' },
            { label: 'Vendor verifications', value: '8', icon: FileCheck2, destination: 'compliance' },
            { label: 'Accounts flagged', value: '3', icon: ShieldAlert, destination: 'accounts' },
          ].map(({ label, value, icon: Icon, destination }) => (
            <button key={label} type="button" onClick={() => selectSection(destination)} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40">
              <Icon aria-hidden="true" className="h-5 w-5 text-amber-700" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">{label}</span>
                <span className="mt-0.5 block text-xs text-slate-500">Review queue</span>
              </span>
              <span className="text-lg font-bold text-slate-900">{value}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );

  const renderTable = () => (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-xs text-slate-500">{filteredRows.length} matching {filteredRows.length === 1 ? 'record' : 'records'}</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="admin-status-filter">Filter by status</label>
          <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-500">
            <Filter aria-hidden="true" className="h-4 w-4" />
            <select
              id="admin-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="max-w-44 bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              {statusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          </span>
          <button type="button" onClick={exportRows} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <Download aria-hidden="true" className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            <tr>
              {table.columns.map(([, label]) => <th key={label} scope="col" className="whitespace-nowrap px-4 py-3.5">{label}</th>)}
              <th scope="col" className="px-4 py-3.5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((row) => (
              <tr key={row.id || row.name} className="transition hover:bg-slate-50/70">
                {table.columns.map(([key]) => (
                  <td key={key} className={`whitespace-nowrap px-4 py-4 ${key === 'id' || key === 'name' ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                    {key === 'status' || key === 'priority' || key === 'risk' || key === 'verification' ? (
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClassName(String(row[key]))}`}>{row[key]}</span>
                    ) : row[key]}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-4">
                  {activeSection === 'accounts' && row.type === 'Vendor' ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/vendors/${row.name.toLowerCase().replaceAll(' ', '-')}`)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50"
                    >
                      View history <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => handleDemoAction('Record review')} className="rounded-md px-2 py-1 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50">
                      Review
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={table.columns.length + 1} className="px-4 py-12 text-center">
                  <p className="text-sm font-semibold text-slate-700">No matching records</p>
                  <p className="mt-1 text-xs text-slate-500">Try a different search term or status filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-1 border-t border-slate-200 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-xs text-slate-500">Showing {filteredRows.length} of {table.rows.length} sample records</p>
        <p className="text-xs text-slate-400">Demo data only · Actions are not saved</p>
      </div>
    </section>
  );

  const renderVendorHistory = () => (
    selectedVendor ? (
      <>
        <button type="button" onClick={() => selectSection('accounts')} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline">
          <ArrowRight aria-hidden="true" className="h-4 w-4 rotate-180" /> Back to users & vendors
        </button>
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ['Vendor contact', selectedVendor.name],
            ['Account handle', selectedVendor.email],
            ['Account status', selectedVendor.status],
          ].map(([label, value]) => (
            <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-2 truncate text-sm font-bold text-slate-900">{value}</p>
            </article>
          ))}
        </section>
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Account activity history</h2>
              <p className="mt-1 text-sm text-slate-500">Vendor actions, account changes and platform reviews.</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassName(selectedVendor.verification)}`}>
              Verification: {selectedVendor.verification}
            </span>
          </div>
          <ol className="divide-y divide-slate-100">
            {selectedVendor.events.map((event) => (
              <li key={`${event.date}-${event.action}`} className="flex gap-4 px-5 py-5 sm:px-6">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <History aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <h3 className="text-sm font-semibold text-slate-900">{event.action}</h3>
                    <time className="text-xs text-slate-400">{event.date}</time>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{event.detail}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{event.source}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="border-t border-slate-200 bg-slate-50/70 px-5 py-3 text-xs text-slate-500">
            Illustrative history only. Production audit records must come from the platform API.
          </p>
        </section>
      </>
    ) : (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="font-bold text-slate-900">Vendor history unavailable</h2>
        <p className="mt-2 text-sm text-slate-500">This sample vendor does not have a history record.</p>
        <button type="button" onClick={() => selectSection('accounts')} className="mt-4 text-sm font-semibold text-emerald-800 hover:underline">
          Back to users & vendors
        </button>
      </section>
    )
  );

  const renderAnalytics = () => (
    <>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total sales', value: '$284,590', note: '+12.8% from last week', icon: CircleDollarSign },
          { label: 'Completed orders', value: '1,176', note: '91.6% completion rate', icon: ShoppingBag },
          { label: 'New accounts', value: '346', note: '+4.6% from last week', icon: UsersRound },
        ].map(({ label, value, note, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon aria-hidden="true" className="h-5 w-5 text-emerald-700" />
            <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-2 text-xs font-medium text-emerald-700">{note}</p>
          </article>
        ))}
      </section>
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="font-bold text-slate-900">Orders by day</h2>
        <p className="mt-1 text-sm text-slate-500">Seven-day trend · sample data</p>
        <div className="mt-6 flex h-64 items-end justify-between gap-3 border-b border-slate-100 px-2">
          {weeklyActivity.map(({ day, value }) => (
            <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs font-semibold text-slate-500">{value}</span>
              <div className="w-full max-w-14 rounded-t-lg bg-emerald-600/85 transition hover:bg-emerald-700" style={{ height: `${value}%` }} />
              <span className="mb-2 text-xs text-slate-500">{day}</span>
            </div>
          ))}
        </div>
      </section>
      <p className="mt-4 text-xs text-slate-500">All analytics on this screen are illustrative and are not connected to marketplace data.</p>
    </>
  );

  const renderSettings = () => (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Bell aria-hidden="true" className="h-5 w-5" /></span>
          <div>
            <h2 className="font-bold text-slate-900">Admin notifications</h2>
            <p className="mt-0.5 text-sm text-slate-500">Choose which demo alerts appear in your preferences.</p>
          </div>
        </div>
        <div className="mt-5 divide-y divide-slate-100">
          {[
            ['disputeAlerts', 'Dispute alerts', 'Get notified when a case needs review.'],
            ['vendorReview', 'Vendor verification', 'Get notified about new vendor submissions.'],
            ['weeklyReport', 'Weekly platform report', 'Receive a weekly marketplace summary.'],
          ].map(([key, label, description]) => (
            <label key={key} className="flex cursor-pointer items-center justify-between gap-4 py-4">
              <span>
                <span className="block text-sm font-semibold text-slate-800">{label}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
              </span>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(event) => setSettings((current) => ({ ...current, [key]: event.target.checked }))}
                className="h-4 w-4 accent-emerald-700"
              />
            </label>
          ))}
        </div>
        <button type="button" onClick={() => handleDemoAction('Saving preferences')} className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900">
          <Check aria-hidden="true" className="h-4 w-4" /> Save preferences
        </button>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700"><ShieldCheck aria-hidden="true" className="h-5 w-5" /></span>
          <div>
            <h2 className="font-bold text-slate-900">Access & platform</h2>
            <p className="mt-0.5 text-sm text-slate-500">Current environment information.</p>
          </div>
        </div>
        <dl className="mt-5 divide-y divide-slate-100 text-sm">
          <div className="flex justify-between gap-3 py-3"><dt className="text-slate-500">Environment</dt><dd className="font-semibold text-slate-800">Demo</dd></div>
          <div className="flex justify-between gap-3 py-3"><dt className="text-slate-500">Data source</dt><dd className="font-semibold text-slate-800">Sample records</dd></div>
          <div className="flex justify-between gap-3 py-3"><dt className="text-slate-500">Admin permissions</dt><dd className="font-semibold text-amber-700">Not configured</dd></div>
        </dl>
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          This interface is a visual demo. Server-side administrator roles and persistent settings must be configured before production use.
        </p>
      </section>
    </div>
  );

  const renderSection = () => {
    if (activeSection === 'overview') return renderOverview();
    if (activeSection === 'vendor-history') return renderVendorHistory();
    if (activeSection === 'analytics') return renderAnalytics();
    if (activeSection === 'settings') return renderSettings();
    return renderTable();
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-900 lg:flex">
      <aside className="flex w-full shrink-0 flex-col bg-[#10243a] text-slate-200 lg:sticky lg:top-0 lg:h-screen lg:w-[250px]">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-lg font-black text-white">T</span>
          <div>
            <p className="text-sm font-bold text-white">TradeSphere</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Platform owner</p>
          </div>
        </div>
        <nav aria-label="Admin navigation" className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:px-3 lg:py-5">
          <p className="hidden px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 lg:block">Workspace</p>
          {navigation.map(({ id, label, icon: Icon, badge }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => selectSection(id)}
                className={`inline-flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition lg:w-full ${active ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-white/15 text-white' : 'bg-white/10 text-slate-300'}`}>{badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-800 text-xs font-bold text-emerald-100">{adminInitials || 'AD'}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-white">{adminName}</span>
              <span className="block text-[10px] text-slate-400">Owner console · demo</span>
            </span>
          </div>
          <LogoutButton className="mt-2 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-60" />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-[68px] items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          {table ? (
            <div className="min-w-0 flex-1">
              <div className="relative max-w-md">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                aria-label={`Search ${details.title.toLowerCase()}`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setSearch('');
                }}
                placeholder={`Search ${details.title.toLowerCase()}...`}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/10"
              />
              </div>
            </div>
          ) : <div className="flex-1" />}
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800 sm:inline-flex">Demo data</span>
            <button type="button" aria-label="Notifications" onClick={() => setNotice('Notifications shown here are sample data only.')} className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100">
              <Bell aria-hidden="true" className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <LogoutButton className="rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60 lg:hidden" />
            <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">{adminInitials || 'AD'}</span>
            <div className="hidden max-w-40 sm:block">
              <p className="truncate text-xs font-bold text-slate-800">{adminName}</p>
              <p className="text-[10px] text-slate-500">Administrator demo</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
            <AlertTriangle aria-hidden="true" className="h-4 w-4 shrink-0" />
            <p><strong>Demo admin console.</strong> Records and metrics are sample data. Actions are not saved, and administrator permissions are not configured.</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Platform owner <span className="px-1 text-slate-300">/</span> {activeSection === 'vendor-history' ? 'Vendor history' : navigation.find((item) => item.id === activeSection)?.label}</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{details.title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">{details.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {table && (
                <button type="button" onClick={exportRows} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Export
                </button>
              )}
              {activeSection !== 'overview' && activeSection !== 'analytics' && activeSection !== 'settings' && (
                <button type="button" onClick={() => handleDemoAction('Creating a new record')} className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900">
                  <span aria-hidden="true" className="text-lg leading-none">+</span>
                  Add record
                </button>
              )}
            </div>
          </div>

          {notice && (
            <div role="status" className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <p>{notice}</p>
              <button type="button" aria-label="Dismiss message" onClick={() => setNotice('')} className="font-bold text-emerald-800">×</button>
            </div>
          )}

          {renderSection()}
          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 text-[11px] text-slate-400">
            <span>TradeSphere admin · Interface preview</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" /> Updated just now · Sample data</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;