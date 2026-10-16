// src/pages/Account.jsx
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Bell, CheckCircle, ChevronRight, CreditCard, MapPin, Package, ShieldCheck, Store, Wallet } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { useAuth } from '../hooks/useAuth';
import { getMyOrders } from '../api/auth';
import LogoutButton from '../components/auth/LogoutButton';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/+$/, '');

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
  const [activeSection, setActiveSection] = useState(() => {
    const section = searchParams.get('section');
    return menuItems.some((item) => item.label === section) ? section : 'Account info';
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orders, setOrders] = useState([]);
  const savedTimer = useRef(null);

  const auth = useAuth();
  const [profileUser, setProfileUser] = useState(auth?.user || null);

  const [formValues, setFormValues] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    role: 'BUYER',
  });

  useEffect(() => {
    if (auth?.user) {
      setProfileUser((prev) => ({ ...prev, ...auth.user }));
    }
  }, [auth?.user]);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        const fetchedUser = data.user || data;
        setProfileUser(fetchedUser);
        if (typeof auth?.setUser === 'function') {
          auth.setUser(fetchedUser);
        }
      })
      .catch(() => {});

    getMyOrders()
      .then((data) => {
        if (isMounted) setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isMounted) setOrders([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentUser = profileUser || auth?.user;
  const accountName = currentUser?.fullName || currentUser?.name || currentUser?.email || 'Account';
  const accountEmail = currentUser?.email || '—';
  const accountPhone = currentUser?.phoneNumber || '—';
  const accountRole = currentUser?.role || 'BUYER';
  const isVendor = accountRole === 'VENDOR';
  const accountInitials = accountName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  useEffect(() => {
    setFormValues({
      fullName: currentUser?.fullName || currentUser?.name || '',
      phoneNumber: currentUser?.phoneNumber || '',
      email: currentUser?.email || '',
      role: currentUser?.role || 'BUYER',
    });
  }, [currentUser, editing]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => () => clearTimeout(savedTimer.current), []);

  const submitProfileUpdate = async (payload) => {
    setErrorMsg('');
    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `Failed to update profile (${response.status}).`);
      }

      const updatedUser = data?.user || data;
      setProfileUser(updatedUser);
      if (typeof auth?.setUser === 'function') {
        auth.setUser(updatedUser);
      }
      if (typeof auth?.refresh === 'function') {
        await auth.refresh();
      }

      setEditing(false);
      setSaved(true);
      clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    await submitProfileUpdate({
      fullName: formValues.fullName.trim(),
      phoneNumber: formValues.phoneNumber.trim(),
      email: formValues.email.trim(),
      role: formValues.role,
    });
  };

  const toggleSellerRole = async () => {
    const nextRole = isVendor ? 'BUYER' : 'VENDOR';
    await submitProfileUpdate({
      fullName: (currentUser?.fullName || currentUser?.name || accountName).trim(),
      phoneNumber: (currentUser?.phoneNumber || '').trim(),
      email: (currentUser?.email || '').trim(),
      role: nextRole,
    });
  };

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  return (
    <main className="min-h-[70vh] bg-[#f6f8fc]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">Your TradeSphere account</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Profile overview</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your personal details and track your {isVendor ? 'seller & buyer' : 'buyer'} activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isVendor && (
              <Link
                to="/vendor-workspace"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-700 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-900 hover:bg-emerald-100"
              >
                <Store className="h-4 w-4" />
                Open Vendor Workspace
              </Link>
            )}
            <button
              type="button"
              disabled={saving}
              onClick={toggleSellerRole}
              className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-60"
            >
              <Store className="h-4 w-4" />
              {isVendor ? 'Switch to Buyer' : 'Become a Seller'}
            </button>
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setEditing((value) => !value);
              }}
              className="rounded-lg border border-green-700 px-4 py-2.5 text-sm font-bold text-green-800 hover:bg-green-50"
            >
              {editing ? 'Cancel edit' : 'Edit profile'}
            </button>
          </div>
        </div>

        {saved && (
          <p role="status" className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            Profile details saved.
          </p>
        )}
        {errorMsg && (
          <p role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
            {errorMsg}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-green-200 to-green-700 text-xl font-bold text-white">
                {accountInitials}
              </div>
              <div>
                <p className="font-bold text-slate-900">{accountName}</p>
                <p className="text-xs text-slate-500">{accountEmail}</p>
                <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${isVendor ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                  {isVendor ? 'Verified Seller' : 'Gold buyer'}
                </span>
              </div>
            </div>
            <nav aria-label="Account sections" className="mt-4 space-y-1">
              {menuItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveSection(label)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold ${activeSection === label ? 'bg-green-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  <ChevronRight className="ml-auto h-4 w-4" />
                </button>
              ))}
            </nav>
            <LogoutButton className="mt-5 w-full border-t border-slate-100 pt-4 text-left text-sm font-semibold text-orange-800 disabled:opacity-60" />
          </aside>

          <section className="min-w-0">
            {activeSection === 'Account info' ? (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { label: 'Total spent', value: formatPrice(totalSpent), action: 'View orders', icon: Wallet, tone: 'text-green-700' },
                    { label: 'Account role', value: accountRole, action: 'Manage verification', icon: ShieldCheck, tone: 'text-orange-600' },
                    { label: 'Total orders', value: `${orders.length} Order(s)`, action: 'View history', icon: Package, tone: 'text-violet-700' },
                  ].map(({ label, value, action, icon: Icon, tone }) => (
                    <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-xl bg-slate-50 ${tone}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                          <p className="mt-1 font-bold text-slate-900">{value}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSection('My orders')}
                        className={`mt-4 flex items-center gap-1 text-xs font-bold ${tone}`}
                      >
                        {action}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </article>
                  ))}
                </div>

                {editing ? (
                  <form onSubmit={saveProfile} className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
                    <h2 className="text-lg font-bold text-slate-900">Edit personal details</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="text-xs font-semibold text-slate-600">
                        Full name
                        <input
                          type="text"
                          required
                          value={formValues.fullName}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Your full name"
                          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-green-600"
                        />
                      </label>
                      <label className="text-xs font-semibold text-slate-600">
                        Phone number
                        <input
                          type="tel"
                          value={formValues.phoneNumber}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                          placeholder="+234 800 000 0000"
                          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-green-600"
                        />
                      </label>
                      <label className="text-xs font-semibold text-slate-600">
                        Email address
                        <input
                          type="email"
                          required
                          value={formValues.email}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="JohnDoe@gmail.com"
                          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-green-600"
                        />
                      </label>
                      <label className="text-xs font-semibold text-slate-600">
                        Account role
                        <select
                          value={formValues.role}
                          onChange={(e) => setFormValues((prev) => ({ ...prev, role: e.target.value }))}
                          className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-green-600"
                        >
                          <option value="BUYER">Buyer</option>
                          <option value="VENDOR">Seller (Vendor)</option>
                        </select>
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="mt-5 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-60"
                    >
                      {saving ? 'Saving…' : 'Save changes'}
                    </button>
                  </form>
                ) : (
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <article className="rounded-2xl border border-slate-200 bg-white">
                      <h2 className="border-b border-slate-200 px-5 py-4 text-sm font-bold uppercase tracking-wide text-slate-800">
                        Personal details
                      </h2>
                      <dl className="grid grid-cols-2 gap-x-3 gap-y-5 p-5 text-sm">
                        <div>
                          <dt className="text-[10px] font-bold uppercase text-slate-400">Full name</dt>
                          <dd className="mt-1 font-semibold text-slate-900">{accountName}</dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-bold uppercase text-slate-400">Phone</dt>
                          <dd className="mt-1 font-semibold text-slate-900">{accountPhone}</dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="text-[10px] font-bold uppercase text-slate-400">Email address</dt>
                          <dd className="mt-1 font-semibold text-slate-900">{accountEmail}</dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-bold uppercase text-slate-400">Account status</dt>
                          <dd className="mt-1 font-semibold text-green-700">{isVendor ? 'Verified Seller' : 'Gold buyer'}</dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-bold uppercase text-slate-400">Role</dt>
                          <dd className="mt-1 font-semibold text-slate-900">{accountRole}</dd>
                        </div>
                      </dl>
                    </article>
                    <article className="rounded-2xl border border-slate-200 bg-white">
                      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">Vendor KYC & Address</h2>
                        <Link to="/account/verification" className="text-xs font-bold text-green-700">
                          Verify Business
                        </Link>
                      </div>
                      <div className="flex gap-3 p-5">
                        <MapPin className="h-5 w-5 shrink-0 text-green-700" />
                        <div>
                          <p className="font-bold text-slate-900">{accountName}</p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {orders[orders.length - 1]?.shippingAddress || 'Complete checkout or business verification to save your primary address.'}
                          </p>
                        </div>
                      </div>
                    </article>
                  </div>
                )}
              </>
            ) : (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                <p className="text-xs font-bold uppercase tracking-wide text-green-700">Account section</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{activeSection}</h2>
                {activeSection === 'My orders' ? (
                  orders.length > 0 ? (
                    <div className="mt-5 space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="rounded-xl border border-slate-200 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-bold text-slate-900">Order #{order.id}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                Placed {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recently'} · {(order.items || []).length} item(s)
                              </p>
                            </div>
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                              {order.status || 'PAID'}
                            </span>
                          </div>
                          <p className="mt-4 text-sm font-semibold text-slate-800">Order total: {formatPrice(Number(order.totalAmount || 0))}</p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <Link to="/orders/confirmation" state={{ order }} className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-bold text-white">
                              Track order
                            </Link>
                            <Link to="/orders/review" state={{ order }} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700">
                              Review packing proof
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">
                      You have no orders yet. <Link to="/marketplace" className="font-semibold text-green-700">Browse the marketplace</Link>.
                    </p>
                  )
                ) : activeSection === 'Address book' ? (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="font-semibold text-slate-900">{accountName}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {orders[orders.length - 1]?.shippingAddress || 'No saved addresses yet.'}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-600">
                    Connected to your live TradeSphere MongoDB account.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setActiveSection('Account info')}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-green-700"
                >
                  Back to account overview <ArrowRight className="h-4 w-4" />
                </button>
              </section>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Account;