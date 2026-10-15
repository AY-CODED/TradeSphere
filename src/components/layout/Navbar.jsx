// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Mail, Menu, Moon, Search, ShoppingCart, Sun, X } from 'lucide-react';
import Logo from '../../assets/images/Logo.png';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import LogoutButton from '../auth/LogoutButton';

const baseNavigation = [
  { label: 'Marketplace', to: '/marketplace', active: (pathname) => pathname.startsWith('/marketplace') || pathname.startsWith('/products/') },
  { label: 'Logistics', to: '/account?section=My%20orders', active: (pathname) => pathname.startsWith('/orders') },
];

const Navbar = () => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isVendor = user?.role === 'VENDOR' || user?.role === 'ADMIN';
  const navigation = isVendor
    ? [
        ...baseNavigation,
        { label: 'Vendor workspace', to: '/vendor-workspace', active: (pathname) => pathname.startsWith('/vendor-workspace') },
      ]
    : baseNavigation;

  const accountName = user?.fullName || user?.name || user?.email || 'Account';
  const accountInitials = accountName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/marketplace?q=${encodeURIComponent(query)}` : '/marketplace');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#f8f9fc] shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex min-h-12 max-w-[1600px] items-center gap-4 px-4 py-2 sm:px-6 lg:gap-7 lg:px-7">
        <Link to="/" aria-label="TradeSphere home" className="flex w-[132px] shrink-0 items-center">
          <img src={Logo} alt="TradeSphere" className="h-8 w-auto object-contain" />
        </Link>

        <form onSubmit={submitSearch} className="relative hidden min-w-36 max-w-[500px] flex-1 sm:block">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            aria-label="Search products and vendors"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, vendors, or services..."
            className="h-8 w-full rounded-md border border-transparent bg-[#e2f3eb] pl-8 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/15"
          />
        </form>

        <nav aria-label="Main navigation" className="ml-auto hidden shrink-0 items-center gap-5 md:flex lg:gap-7">
          {navigation.map(({ label, to, active }) => (
            <Link
              key={label}
              to={to}
              className={`whitespace-nowrap text-xs font-semibold transition-colors hover:text-emerald-700 ${
                active(location.pathname) ? 'text-emerald-800' : 'text-slate-800'
              }`}
            >
              {label}
            </Link>
          ))}
          <a href="mailto:support@tradesphere.africa" className="whitespace-nowrap text-xs font-semibold text-slate-800 transition-colors hover:text-emerald-700">
            Support
          </a>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0 sm:gap-3">
          <Link
            to="/cart"
            aria-label={`Shopping cart with ${itemCount} items`}
            className="relative rounded p-1.5 text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && <span className="absolute -right-1 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-emerald-700 px-0.5 text-[9px] font-bold text-white">{itemCount}</span>}
          </Link>
          <a href="mailto:support@tradesphere.africa" aria-label="Messages and support" className="hidden rounded p-1.5 text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 sm:inline-flex">
            <Mail className="h-4 w-4" />
          </a>
          <button
            type="button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
            onClick={toggleTheme}
            className="rounded p-1.5 text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button type="button" aria-label="Notifications" className="rounded p-1.5 text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700">
            <Bell className="h-4 w-4" />
          </button>
          {user ? (
            <>
              <Link to="/account" className="flex shrink-0 items-center gap-2 border-l border-slate-300 pl-3 text-xs font-medium text-slate-800">
                <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-emerald-700 text-[9px] font-bold text-white">{accountInitials}</span>
                <span className="hidden max-w-28 truncate whitespace-nowrap sm:inline">{accountName}</span>
              </Link>
              <LogoutButton className="hidden rounded px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 sm:inline-flex" />
            </>
          ) : (
            <Link to="/signin" className="hidden whitespace-nowrap text-xs font-semibold text-emerald-800 hover:underline sm:inline">
              Sign in
            </Link>
          )}
          <button
            type="button"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="rounded p-1.5 text-slate-600 hover:bg-slate-200 md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <form onSubmit={submitSearch} className="relative px-4 pb-2 sm:hidden">
        <Search aria-hidden="true" className="absolute left-7 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        <input
          aria-label="Search products and vendors"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products, vendors, or services..."
          className="h-8 w-full rounded-md border border-transparent bg-[#e2f3eb] pl-8 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/15"
        />
      </form>

      {isOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navigation.map(({ label, to }) => (
              <Link key={label} to={to} onClick={() => setIsOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50">
                {label}
              </Link>
            ))}
            <a href="mailto:support@tradesphere.africa" onClick={() => setIsOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50">
              Support
            </a>
            {user ? (
              <>
                <Link to="/account" onClick={() => setIsOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50">
                  My account
                </Link>
                <LogoutButton className="rounded-md px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-emerald-50 disabled:opacity-60" />
              </>
            ) : (
              <>
                <Link to="/signin" onClick={() => setIsOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50">
                  Sign in
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50">
                  Create an account
                </Link>
              </>
            )}
          </div>
        </nav>
      )}

      <div aria-hidden="true" className="h-[3px] bg-[#c9b8ff]" />
    </header>
  );
};

export default Navbar;