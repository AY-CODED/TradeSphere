import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  History,
  LayoutDashboard,
  Package,
  Plus,
  Settings2,
  ShoppingBag,
  Sparkles,
  UsersRound,
  Wallet,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import LogoutButton from '../components/auth/LogoutButton';
import { useAuth } from '../hooks/useAuth';

const navigation = [
  { label: 'Overview', icon: LayoutDashboard, description: 'Your business at a glance' },
  { label: 'Orders', icon: ShoppingBag, description: 'Manage incoming orders' },
  { label: 'Products', icon: Package, description: 'Manage your product catalogue' },
  { label: 'Inventory', icon: Boxes, description: 'Keep stock up to date' },
  { label: 'Analytics', icon: BarChart3, description: 'Understand your performance' },
  { label: 'Customers', icon: UsersRound, description: 'Build buyer relationships' },
  { label: 'Payouts', icon: Wallet, description: 'Review your payment activity' },
  { label: 'Activity', icon: History, description: 'Review actions recorded in this workspace session' },
  { label: 'Settings', icon: Settings2, description: 'Manage business preferences' },
];

const dashboardMetrics = [
  { label: 'Gross sales', icon: Wallet },
  { label: 'Orders to fulfil', icon: ShoppingBag },
  { label: 'Active products', icon: Package },
  { label: 'Store visits', icon: UsersRound },
];

const sectionEmptyStates = {
  Orders: {
    icon: ShoppingBag,
    title: 'Your orders will show up here',
    description: 'When buyers place orders with your business, you can review details and manage fulfilment here.',
  },
  Products: {
    icon: Package,
    title: 'Start building your catalogue',
    description: 'Add your first product to prepare your TradeSphere storefront for buyers.',
  },
  Inventory: {
    icon: Boxes,
    title: 'No inventory to track yet',
    description: 'Your stock levels will appear here after products are connected to your vendor catalogue.',
  },
  Analytics: {
    icon: BarChart3,
    title: 'Your performance insights are on the way',
    description: 'Once your business data is connected, this space will show your sales and marketplace trends.',
  },
  Customers: {
    icon: UsersRound,
    title: 'Your customer list is ready to grow',
    description: 'Buyers who place orders with your business will appear here.',
  },
  Payouts: {
    icon: Wallet,
    title: 'Payout activity will appear here',
    description: 'Review your available balance and payout history once payment services are connected.',
  },
  Settings: {
    icon: Settings2,
    title: 'Business settings',
    description: 'Your vendor profile and workspace preferences will be available here.',
  },
};

const VendorWorkspace = () => {
  const [activeSection, setActiveSection] = useState('Overview');
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productNotice, setProductNotice] = useState('');
  const [products, setProducts] = useState([]);
  const [vendorActivity, setVendorActivity] = useState([]);
  const { user } = useAuth();
  const vendorName = user?.businessName || user?.fullName || user?.name || user?.email || 'Your business';
  const initials = vendorName.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  const openProductForm = () => {
    setProductNotice('');
    setProductFormOpen(true);
  };

  const submitProductForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const product = {
      id: `DEMO-${Date.now()}`,
      name: String(formData.get('productName') || '').trim(),
      category: String(formData.get('category') || '').trim(),
      sku: String(formData.get('sku') || '').trim() || '—',
      price: Number(formData.get('price')),
      quantity: Number(formData.get('quantity')),
      createdAt: new Date().toLocaleString(),
    };
    setProducts((current) => [product, ...current]);
    setVendorActivity((current) => [{
      id: product.id,
      action: 'Added product to demo catalogue',
      detail: `${product.name} · ${product.category}`,
      time: product.createdAt,
    }, ...current]);
    setProductNotice(`${product.name} was added to this session's demo catalogue. It is not published to the marketplace.`);
    setProductFormOpen(false);
    setActiveSection('Products');
  };

  const selectSection = (section) => {
    if (section !== activeSection) {
      setVendorActivity((current) => [{
        id: `VIEW-${Date.now()}`,
        action: `Viewed ${section}`,
        detail: `Opened the ${section.toLowerCase()} section.`,
        time: new Date().toLocaleString(),
      }, ...current]);
    }
    setActiveSection(section);
    setProductNotice('');
  };

  const activeDescription = navigation.find((item) => item.label === activeSection)?.description;
  const emptyState = sectionEmptyStates[activeSection];
  const EmptyIcon = emptyState?.icon;

  return (
    <div className="min-h-screen bg-[#f5f7f6] text-slate-900 lg:flex">
      <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[258px] lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:px-6 lg:py-6">
          <Link to="/" aria-label="TradeSphere home" className="inline-flex items-center">
            <img src={Logo} alt="TradeSphere" className="h-9 w-auto object-contain" />
          </Link>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800 lg:hidden">
            Vendor
          </span>
        </div>

        <div className="hidden px-6 pb-4 lg:block">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">Vendor portal</p>
          </div>
        </div>

        <nav aria-label="Vendor workspace sections" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:gap-1.5 lg:overflow-y-auto lg:px-4 lg:pb-4">
          <p className="hidden px-3 pb-2 pt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 lg:block">Workspace</p>
          {navigation.map(({ label, icon: Icon }) => {
            const active = activeSection === label;
            return (
              <button
                key={label}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => selectSection(label)}
                className={`inline-flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 lg:w-full ${
                  active
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="hidden border-t border-slate-200 p-4 lg:block">
          <a
            href="mailto:support@tradesphere.africa"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <CircleHelp aria-hidden="true" className="h-4 w-4" />
            Vendor support
            <ArrowRight aria-hidden="true" className="ml-auto h-3.5 w-3.5" />
          </a>
          <LogoutButton className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60" />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-9">
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <span>Vendor workspace</span>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-800">{activeSection}</span>
          </div>
          <span className="text-xs font-semibold text-slate-600 sm:hidden">{activeSection}</span>
          <div className="ml-auto flex items-center gap-2.5 sm:gap-4">
            <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 md:inline-flex">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Vendor data not connected
            </span>
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications"
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <Bell aria-hidden="true" className="h-4 w-4" />
            </button>
            <div className="flex min-w-0 items-center gap-2.5 border-l border-slate-200 pl-3 sm:pl-4">
              <div aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">
                {initials || 'V'}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="max-w-40 truncate text-xs font-semibold text-slate-900">{vendorName}</p>
                <p className="text-[10px] text-slate-500">Vendor account</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-9">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
                <Building2 aria-hidden="true" className="h-4 w-4" />
                {activeSection === 'Overview' ? 'Business overview' : 'Vendor workspace'}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-[34px]">{activeSection}</h1>
              <p className="mt-2 text-sm text-slate-600">{activeDescription}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {activeSection === 'Overview' && (
                <button
                  type="button"
                  disabled
                  title="Available when vendor data is connected"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-400 disabled:cursor-not-allowed"
                >
                  <ArrowDownToLine aria-hidden="true" className="h-4 w-4" />
                  Export
                </button>
              )}
              {(activeSection === 'Overview' || activeSection === 'Products') && (
                <button
                  type="button"
                  onClick={openProductForm}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  Add product
                </button>
              )}
            </div>
          </div>

          {productNotice && (
            <p role="status" aria-live="polite" className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
              {productNotice}
            </p>
          )}

          {activeSection === 'Overview' ? (
            <>
              <section aria-label="Business metrics" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardMetrics.map(({ label, icon: Icon }) => (
                  <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-slate-600">{label}</p>
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-400" aria-label={`${label} unavailable`}>—</p>
                    <p className="mt-1 text-xs text-slate-500">Available when your vendor data is connected</p>
                  </article>
                ))}
              </section>

              <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.9fr)]">
                <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Sales performance</h2>
                      <p className="mt-1 text-sm text-slate-500">Your revenue trends will appear here.</p>
                    </div>
                    <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500">No data yet</span>
                  </div>
                  <div className="mt-5 grid min-h-56 place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
                    <div>
                      <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white text-slate-400 shadow-sm">
                        <BarChart3 aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <p className="mt-3 text-sm font-semibold text-slate-700">Your sales chart will appear here</p>
                      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">Connect your vendor services to see verified sales activity and performance over time.</p>
                    </div>
                  </div>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Get your store ready</h2>
                      <p className="mt-1 text-sm text-slate-500">A few steps to get started.</p>
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-700">
                      <Sparkles aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    <button type="button" onClick={() => selectSection('Settings')} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600"><Building2 aria-hidden="true" className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800">Complete business profile</span><span className="mt-0.5 block text-xs text-slate-500">Add your company details</span></span>
                      <ChevronRight aria-hidden="true" className="h-4 w-4 text-slate-400" />
                    </button>
                    <button type="button" onClick={openProductForm} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600"><Package aria-hidden="true" className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800">Add your first product</span><span className="mt-0.5 block text-xs text-slate-500">Set up your catalogue</span></span>
                      <ChevronRight aria-hidden="true" className="h-4 w-4 text-slate-400" />
                    </button>
                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-slate-400"><Check aria-hidden="true" className="h-4 w-4" /></span>
                      <span className="text-sm font-medium text-slate-500">Connect vendor services</span>
                      <span className="ml-auto rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">Coming soon</span>
                    </div>
                  </div>
                  <a href="mailto:support@tradesphere.africa" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline">
                    Need help getting started?
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                </article>
              </section>

              <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Recent orders</h2>
                    <p className="mt-1 text-sm text-slate-500">Stay on top of your latest buyer activity.</p>
                  </div>
                  <button type="button" onClick={() => selectSection('Orders')} className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-800 hover:underline">
                    View orders <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-5 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
                  <ClipboardList aria-hidden="true" className="h-6 w-6 text-slate-400" />
                  <p className="mt-2 text-sm font-semibold text-slate-700">No order activity to show</p>
                  <p className="mt-1 text-xs text-slate-500">New orders will be listed here when available.</p>
                </div>
              </section>
            </>
          ) : activeSection === 'Products' ? (
            <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5">
                <div>
                  <h2 className="font-bold text-slate-900">Your product catalogue</h2>
                  <p className="mt-1 text-sm text-slate-500">{products.length} product{products.length === 1 ? '' : 's'} added in this session</p>
                </div>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">Session demo</span>
              </div>
              {products.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Product</th>
                        <th className="px-5 py-3">SKU</th>
                        <th className="px-5 py-3">Unit price</th>
                        <th className="px-5 py-3">Available</th>
                        <th className="px-5 py-3">Added</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-5 py-4"><p className="font-semibold text-slate-900">{product.name}</p><p className="mt-0.5 text-xs text-slate-500">{product.category}</p></td>
                          <td className="px-5 py-4 text-slate-600">{product.sku}</td>
                          <td className="px-5 py-4 font-semibold text-slate-800">${product.price.toFixed(2)}</td>
                          <td className="px-5 py-4 text-slate-600">{product.quantity}</td>
                          <td className="px-5 py-4 text-xs text-slate-500">{product.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid min-h-64 place-items-center px-5 py-10 text-center">
                  <div>
                    <Package aria-hidden="true" className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 text-sm font-semibold text-slate-800">Your catalogue is empty</p>
                    <p className="mt-1 text-xs text-slate-500">Add a product to see it listed here in this session.</p>
                    <button type="button" onClick={openProductForm} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900">
                      <Plus aria-hidden="true" className="h-4 w-4" /> Add a product
                    </button>
                  </div>
                </div>
              )}
              <p className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500">Products are visible only in this browser session and are not published to the marketplace.</p>
            </section>
          ) : activeSection === 'Activity' ? (
            <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 p-5">
                <h2 className="font-bold text-slate-900">Your workspace activity</h2>
                <p className="mt-1 text-sm text-slate-500">Actions recorded during this browser session.</p>
              </div>
              {vendorActivity.length ? (
                <ol className="divide-y divide-slate-100">
                  {vendorActivity.map((activity) => (
                    <li key={activity.id} className="flex gap-3 px-5 py-4">
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><History aria-hidden="true" className="h-4 w-4" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">{activity.action}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{activity.detail}</p>
                      </div>
                      <time className="shrink-0 pt-1 text-[11px] text-slate-400">{activity.time}</time>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="grid min-h-56 place-items-center px-5 py-10 text-center">
                  <div>
                    <History aria-hidden="true" className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 text-sm font-semibold text-slate-800">No activity recorded yet</p>
                    <p className="mt-1 text-xs text-slate-500">Workspace actions and products added in this session will appear here.</p>
                  </div>
                </div>
              )}
              <p className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500">This session history is temporary. A connected vendor service is required for a permanent activity record.</p>
            </section>
          ) : (
            <section className="mt-7 rounded-xl border border-slate-200 bg-white p-5 sm:p-8">
              <div className="mx-auto flex min-h-[340px] max-w-lg flex-col items-center justify-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
                  <EmptyIcon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-lg font-bold text-slate-900">{emptyState.title}</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{emptyState.description}</p>
                {activeSection === 'Products' && (
                  <button type="button" onClick={openProductForm} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    Add a product
                  </button>
                )}
                {activeSection !== 'Products' && activeSection !== 'Settings' && (
                  <button type="button" onClick={() => selectSection('Overview')} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline">
                    Back to overview <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                )}
              </div>
            </section>
          )}

          <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>TradeSphere Vendor Workspace</span>
            <span>Need assistance? <a href="mailto:support@tradesphere.africa" className="font-semibold text-emerald-800 hover:underline">Contact vendor support</a></span>
          </footer>
        </main>
      </div>

      {productFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setProductFormOpen(false);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="add-product-title" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Product catalogue</p>
                <h2 id="add-product-title" className="mt-1 text-xl font-bold text-slate-900">Add a product</h2>
                <p className="mt-1 text-sm text-slate-500">Enter the product details you’ll need for your listing.</p>
              </div>
              <button type="button" aria-label="Close add product form" onClick={() => setProductFormOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-emerald-700">
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={submitProductForm} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Product name
                <input required name="productName" placeholder="e.g. Commercial water pump" className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Category
                  <input required name="category" placeholder="Choose a category" className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  SKU <span className="font-normal text-slate-400">(optional)</span>
                  <input name="sku" placeholder="Your stock reference" className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Unit price
                  <input required min="0" step="0.01" type="number" name="price" placeholder="0.00" className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Available quantity
                  <input required min="0" step="1" type="number" name="quantity" placeholder="0" className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
                </label>
              </div>
              <label className="block text-sm font-semibold text-slate-700">
                Description
                <textarea name="description" rows="3" placeholder="Describe the product for buyers" className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
              </label>
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900">
                This demo adds the product to your current session only. It will not publish to the marketplace or persist after you leave.
              </p>
              {productNotice && <p role="alert" aria-live="polite" className="text-sm font-medium text-rose-700">{productNotice}</p>}
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setProductFormOpen(false)} className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="h-10 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900">
                  Add to demo catalogue
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default VendorWorkspace;
