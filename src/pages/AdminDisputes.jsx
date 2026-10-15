// src/pages/AdminDisputes.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Bell,
  Download,
  FileText,
  Search,
  ShieldCheck,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDisputes, updateDisputeStatus } from '../api/auth';
import { formatPrice } from '../utils/formatPrice';
import { useAuth } from '../hooks/useAuth';

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

const AdminDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    getDisputes()
      .then((data) => {
        if (active) setDisputes(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setDisputes([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const cycleStatus = async (dispute) => {
    const nextStatus =
      dispute.status === 'Open'
        ? 'Under review'
        : dispute.status === 'Under review'
        ? 'Resolved'
        : 'Open';
    try {
      const updated = await updateDisputeStatus(dispute.id, nextStatus);
      setDisputes((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } catch {
      // ignore
    }
  };

  const filteredDisputes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return disputes;
    return disputes.filter((d) =>
      `${d.id} ${d.orderId} ${d.stakeholderName} ${d.issue}`.toLowerCase().includes(q)
    );
  }, [disputes, searchQuery]);

  const stats = [
    { label: 'Open cases', value: String(disputes.filter((d) => d.status === 'Open').length), tone: 'emerald', icon: ShieldCheck },
    { label: 'Under review', value: String(disputes.filter((d) => d.status === 'Under review').length), tone: 'slate', icon: FileText },
    { label: 'Awaiting evidence', value: String(disputes.filter((d) => d.status === 'Awaiting evidence').length), tone: 'amber', icon: AlertTriangle },
    { label: 'Resolved', value: String(disputes.filter((d) => d.status === 'Resolved').length), tone: 'red', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#edf2f5] px-4 py-5 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[20px] border border-slate-200 bg-[#f7f9fb] shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-[#f9fafb] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="grid h-8 w-8 place-items-center rounded-md bg-[#0d2136] text-sm font-black text-white">
              T
            </Link>
          </div>
          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
            <Link to="/marketplace" className="transition hover:text-emerald-800">Marketplace</Link>
            <Link to="/account?section=My%20orders" className="transition hover:text-emerald-800">Logistics</Link>
            <Link to="/account" className="transition hover:text-emerald-800">Account</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold text-slate-700">{user?.fullName || user?.email || 'Admin'}</span>
          </div>
        </header>

        <div className="flex min-h-[840px] flex-col lg:flex-row">
          <aside className="w-full bg-[#0d2136] px-4 py-5 text-slate-200 lg:w-[230px] lg:shrink-0">
            <div className="mt-4 space-y-1.5">
              {navItems.map(({ label, icon: Icon, active }) => (
                <button
                  key={label}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    active ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-[#18314d] hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1 bg-[#f3f6fb] p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Disputes</h1>
                <p className="mt-1 text-sm text-slate-500">Live dispute cases fetched directly from MongoDB.</p>
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
                    <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search case ID or stakeholder"
                    placeholder="Search case ID, order, stakeholder..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none"
                  />
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
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-slate-500">Loading disputes…</td>
                      </tr>
                    ) : filteredDisputes.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-slate-500">No disputes reported in the database.</td>
                      </tr>
                    ) : (
                      filteredDisputes.map((d) => (
                        <tr key={d.id}>
                          <td className="px-4 py-3 font-semibold text-slate-900">#{String(d.id).slice(-6).toUpperCase()}</td>
                          <td className="px-4 py-3">#{String(d.orderId).slice(-6).toUpperCase()}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{d.stakeholderName}</div>
                            <div className="text-[11px] text-slate-500">
                              {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recent'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{d.issue}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{formatPrice(Number(d.amount || 0))}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full bg-rose-100 px-2 py-1 text-[11px] font-semibold text-rose-700">
                              {d.priority || 'High'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${d.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => cycleStatus(d)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                            >
                              Advance Status <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDisputes;