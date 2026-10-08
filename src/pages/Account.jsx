import { useState } from 'react';
import { ArrowRight, Bell, CheckCircle, ChevronRight, CreditCard, MapPin, Package, ShieldCheck, Wallet } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatPrice } from '../data/customerProducts';

const menuItems = [
  { label: 'Account info', icon: CheckCircle },
  { label: 'My orders', icon: Package },
  { label: 'Trade wallet', icon: Wallet },
  { label: 'Address book', icon: MapPin },
  { label: 'Payment methods', icon: CreditCard },
  { label: 'Support center', icon: Bell },
];

const Account = () => {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(() => searchParams.get('section') || 'Account info');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const order = JSON.parse(localStorage.getItem('tradesphere-customer-last-order') || 'null');

  const saveProfile = (event) => {
    event.preventDefault();
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="min-h-[70vh] bg-[#f6f8fc]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">Your TradeSphere account</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Profile overview</h1><p className="mt-1 text-sm text-slate-500">Manage your personal details and track your buyer activity.</p></div>
          <button type="button" onClick={() => setEditing((value) => !value)} className="rounded-lg border border-green-700 px-4 py-2.5 text-sm font-bold text-green-800 hover:bg-green-50">{editing ? 'Cancel edit' : 'Edit profile'}</button>
        </div>
        {saved && <p role="status" className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">Profile details saved.</p>}

        <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-green-200 to-green-700 text-xl font-bold text-white">JD</div>
              <div><p className="font-bold text-slate-900">John Doe</p><p className="text-xs text-slate-500">john.doe@tradesphere.africa</p><span className="mt-2 inline-block rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-800">Gold buyer</span></div>
            </div>
            <nav aria-label="Account sections" className="mt-4 space-y-1">
              {menuItems.map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => setActiveSection(label)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold ${activeSection === label ? 'bg-green-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}><Icon className="h-4 w-4" />{label}<ChevronRight className="ml-auto h-4 w-4" /></button>)}
            </nav>
            <button type="button" className="mt-5 w-full border-t border-slate-100 pt-4 text-left text-sm font-semibold text-orange-800">Sign out</button>
          </aside>

          <section className="min-w-0">
            {activeSection === 'Account info' ? (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { label: 'Trade wallet', value: '$4,240.50', action: 'Top up balance', icon: Wallet, tone: 'text-green-700' },
                    { label: 'Loyalty points', value: '1,250 TS', action: 'Redeem rewards', icon: ShieldCheck, tone: 'text-orange-600' },
                    { label: 'Total orders', value: order ? '43 Completed' : '42 Completed', action: 'View history', icon: Package, tone: 'text-violet-700' },
                  ].map(({ label, value, action, icon: Icon, tone }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl bg-slate-50 ${tone}`}><Icon className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 font-bold text-slate-900">{value}</p></div></div><button type="button" onClick={() => setActiveSection(label === 'Total orders' ? 'My orders' : label)} className={`mt-4 flex items-center gap-1 text-xs font-bold ${tone}`}>{action}<ArrowRight className="h-3.5 w-3.5" /></button></article>)}
                </div>
                {editing ? (
                  <form onSubmit={saveProfile} className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
                    <h2 className="text-lg font-bold text-slate-900">Edit personal details</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="text-xs font-semibold text-slate-600">Full name<input defaultValue="John Doe" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-green-600" /></label>
                      <label className="text-xs font-semibold text-slate-600">Phone number<input defaultValue="+234 801 234 5678" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-green-600" /></label>
                      <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Email address<input type="email" defaultValue="john.doe@tradesphere.africa" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-green-600" /></label>
                    </div>
                    <button type="submit" className="mt-5 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-bold text-white">Save changes</button>
                  </form>
                ) : (
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <article className="rounded-2xl border border-slate-200 bg-white">
                      <h2 className="border-b border-slate-200 px-5 py-4 text-sm font-bold uppercase tracking-wide text-slate-800">Personal details</h2>
                      <dl className="grid grid-cols-2 gap-x-3 gap-y-5 p-5 text-sm"><div><dt className="text-[10px] font-bold uppercase text-slate-400">Full name</dt><dd className="mt-1 font-semibold text-slate-900">John Doe</dd></div><div><dt className="text-[10px] font-bold uppercase text-slate-400">Phone</dt><dd className="mt-1 font-semibold text-slate-900">+234 801 234 5678</dd></div><div className="col-span-2"><dt className="text-[10px] font-bold uppercase text-slate-400">Email address</dt><dd className="mt-1 font-semibold text-slate-900">john.doe@tradesphere.africa</dd></div><div><dt className="text-[10px] font-bold uppercase text-slate-400">Buyer tier</dt><dd className="mt-1 font-semibold text-green-700">Gold buyer</dd></div><div><dt className="text-[10px] font-bold uppercase text-slate-400">Joined</dt><dd className="mt-1 font-semibold text-slate-900">October 2022</dd></div></dl>
                    </article>
                    <article className="rounded-2xl border border-slate-200 bg-white">
                      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">Primary address</h2><button type="button" onClick={() => setActiveSection('Address book')} className="text-xs font-bold text-green-700">Edit</button></div>
                      <div className="flex gap-3 p-5"><MapPin className="h-5 w-5 shrink-0 text-green-700" /><div><p className="font-bold text-slate-900">John Doe</p><p className="mt-1 text-sm leading-relaxed text-slate-600">12 Mushin Road, Isolo,<br />Lagos, Lagos State</p><p className="mt-2 text-xs text-slate-500">+234 801 234 5678</p><p className="mt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase text-green-700"><ShieldCheck className="h-3.5 w-3.5" /> Verified shipping location</p></div></div>
                    </article>
                  </div>
                )}
                <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between"><h2 className="font-bold uppercase tracking-wide text-slate-800">Security & activity</h2><button type="button" className="text-xs font-bold text-green-700">Settings</button></div>
                  <div className="mt-4 divide-y divide-slate-100">
                    <div className="flex items-center justify-between gap-4 py-4"><div className="flex items-center gap-3"><Bell className="h-5 w-5 text-slate-500" /><div><p className="text-sm font-semibold text-slate-900">Notifications</p><p className="text-xs text-slate-500">Manage your email and SMS alert preferences.</p></div></div><button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">Configure</button></div>
                    <div className="flex items-center justify-between gap-4 py-4"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-green-700" /><div><p className="text-sm font-semibold text-slate-900">Password & 2FA</p><p className="text-xs text-slate-500">Keep your TradeSphere account secure.</p></div></div><button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">Update</button></div>
                  </div>
                </section>
              </>
            ) : (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                <p className="text-xs font-bold uppercase tracking-wide text-green-700">Account section</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{activeSection}</h2>
                {activeSection === 'My orders' ? (
                  order ? (
                    <div className="mt-5 rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold text-slate-900">Order #{order.id}</p><p className="mt-1 text-xs text-slate-500">Placed {order.date} · {order.items.length} item(s)</p></div><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">Processing</span></div>
                      <p className="mt-4 text-sm font-semibold text-slate-800">Order total: {formatPrice(order.total)}</p>
                      <div className="mt-4 flex flex-wrap gap-3"><Link to="/orders/confirmation" state={{ order }} className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-bold text-white">Track order</Link><Link to="/orders/review" className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700">Review packing proof</Link></div>
                    </div>
                  ) : <p className="mt-3 text-sm text-slate-500">You have no orders yet. <Link to="/marketplace" className="font-semibold text-green-700">Browse the marketplace</Link>.</p>
                ) : activeSection === 'Address book' ? (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4"><p className="font-semibold text-slate-900">John Doe · Home</p><p className="mt-1 text-sm text-slate-600">12 Mushin Road, Isolo, Lagos, Lagos State</p><p className="mt-2 text-xs text-slate-500">+234 801 234 5678</p></div>
                ) : activeSection === 'Trade wallet' ? (
                  <p className="mt-3 text-sm text-slate-600">Available balance <strong className="text-green-700">{formatPrice(4240.5)}</strong>. Wallet transfers are available from your secure buyer dashboard.</p>
                ) : activeSection === 'Payment methods' ? (
                  <p className="mt-3 text-sm text-slate-600">No payment method is stored. Payment details are entered securely during checkout.</p>
                ) : <p className="mt-3 text-sm text-slate-600">Contact our buyer support team for help with orders, payments, or account settings.</p>}
                <button type="button" onClick={() => setActiveSection('Account info')} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-green-700">Back to account overview <ArrowRight className="h-4 w-4" /></button>
              </section>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Account;
