// src/components/layout/Navbar.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Mail, Menu, Moon, Search, ShoppingCart, Sun, X } from 'lucide-react';
import Logo from '../../assets/images/Logo.png';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../api/auth';
import LogoutButton from '../auth/LogoutButton';

const baseNavigation = [
  { label: 'Marketplace', to: '/marketplace', active: (pathname) => pathname.startsWith('/marketplace') || pathname.startsWith('/products/') },
  { label: 'Logistics', to: '/account?section=My%20orders', active: (pathname) => pathname.startsWith('/orders') },
];

// Shared icon-button style: 36px touch target on phones, compact on larger screens.
const iconButton =
  'relative inline-flex items-center justify-center rounded p-2 text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 sm:p-1.5';

const mobileLink =
  'flex min-h-11 items-center rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

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
  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadLabel = unreadCount > 99 ? '99+' : unreadCount;
  const cartLabel = itemCount > 99 ? '99+' : itemCount;

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      return undefined;
    }

    let active = true;
    const loadNotifications = () => {
      getNotifications()
        .then((data) => {
          if (active && Array.isArray(data)) {
            setNotifications(data);
          }
        })
        .catch(() => {});
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user?.id, location.pathname]);

  // Close menus whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
    setNotifOpen(false);
  }, [location.pathname, location.search]);

  // Close notifications on outside click / tap, and both menus on Escape.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setNotifOpen(false);
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationRead(notification.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === notification.id ? { ...item, read: true } : item))
        );
      } catch {
        // ignore
      }
    }
    setNotifOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch {
      // ignore
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/marketplace?q=${encodeURIComponent(query)}` : '/marketplace');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#f8f9fc] shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
      {/*
        Layout by breakpoint:
        - < sm:   logo + actions on row 1, full-width search on row 2
        - sm–lg:  logo + search + actions in one row, nav lives in the hamburger menu
        - lg+:    full desktop nav inline
      */}
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 min-[400px]:px-4 sm:flex-nowrap sm:px-6 lg:gap-x-7 lg:px-7">
        <Link to="/" aria-label="TradeSphere home" className="flex w-[104px] shrink-0 items-center min-[400px]:w-[120px] lg:w-[132px]">
          <img src={Logo} alt="TradeSphere" className="h-7 w-auto object-contain min-[400px]:h-8" />
        </Link>

        {/* Single search form, reflowed per breakpoint */}
        <form
          onSubmit={submitSearch}
          role="search"
          className="relative order-last basis-full sm:order-none sm:min-w-0 sm:max-w-[500px] sm:flex-1 sm:basis-auto"
        >
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            aria-label="Search products and vendors"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, vendors, or services..."
            className="h-10 w-full rounded-md border border-transparent bg-[#e2f3eb] pl-8 pr-3 text-base text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-600/15 sm:h-8 sm:text-xs"
          />
        </form>

        <nav aria-label="Main navigation" className="ml-auto hidden shrink-0 items-center gap-5 lg:flex xl:gap-7">
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

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2 lg:ml-0 lg:gap-3">
          <Link to="/cart" aria-label={`Shopping cart with ${itemCount} items`} className={iconButton}>
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-emerald-700 px-0.5 text-[9px] font-bold text-white">
                {cartLabel}
              </span>
            )}
          </Link>

          <a href="mailto:support@tradesphere.africa" aria-label="Messages and support" className={`${iconButton} hidden lg:inline-flex`}>
            <Mail className="h-4 w-4" />
          </a>

          {/* <button
            type="button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
            onClick={toggleTheme}
            className={iconButton}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button> */}

          {/* Notification Bell & Dropdown.
              On phones the panel anchors to the full-width header (wrapper is not
              positioned) so it can never overflow the screen; from sm up it anchors to the bell. */}
          <div ref={notifRef} className="sm:relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-haspopup="true"
              aria-expanded={notifOpen}
              onClick={() => {
                setNotifOpen((prev) => !prev);
                setIsOpen(false);
              }}
              className={iconButton}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-orange-500 px-0.5 text-[9px] font-bold text-white">
                  {unreadLabel}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute inset-x-3 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:inset-x-auto sm:right-0 sm:w-96">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="inline-flex min-h-8 items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[60dvh] divide-y divide-slate-100 overflow-y-auto overscroll-contain sm:max-h-80">
                  {!user ? (
                    <div className="px-4 py-8 text-center text-xs text-slate-500">
                      Sign in to view your TradeSphere notifications.
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-slate-500">
                      You have no notifications yet.
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNotificationClick(item)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                          item.read ? 'bg-white' : 'bg-emerald-50/40'
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            item.read ? 'bg-slate-300' : 'bg-emerald-600'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-xs font-bold text-slate-900">{item.title}</p>
                            <span className="shrink-0 text-[10px] text-slate-400">
                              {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="mt-0.5 break-words text-xs leading-relaxed text-slate-600">{item.message}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <>
              <Link
                to="/account"
                aria-label="My account"
                className="ml-1 flex shrink-0 items-center gap-2 border-l border-slate-300 pl-2 text-xs font-medium text-slate-800 sm:ml-0 sm:pl-3"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-700 text-[10px] font-bold text-white sm:h-[22px] sm:w-[22px] sm:text-[9px]">{accountInitials}</span>
                <span className="hidden max-w-24 truncate whitespace-nowrap lg:inline xl:max-w-32">{accountName}</span>
              </Link>
              <LogoutButton className="hidden rounded px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 lg:inline-flex" />
            </>
          ) : (
            <Link to="/signin" className="hidden whitespace-nowrap px-1 text-xs font-semibold text-emerald-800 hover:underline lg:inline">
              Sign in
            </Link>
          )}

          <button
            type="button"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setIsOpen((open) => !open);
              setNotifOpen(false);
            }}
            className="inline-flex items-center justify-center rounded p-2 text-slate-600 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain border-t border-slate-200 bg-white px-3 py-3 min-[400px]:px-4 sm:px-6 lg:hidden"
        >
          <div className="mx-auto flex max-w-[1600px] flex-col gap-1 sm:max-w-md sm:ml-auto sm:mr-0">
            {navigation.map(({ label, to, active }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setIsOpen(false)}
                aria-current={active(location.pathname) ? 'page' : undefined}
                className={`${mobileLink} ${active(location.pathname) ? 'bg-emerald-50 text-emerald-800' : ''}`}
              >
                {label}
              </Link>
            ))}
            <a href="mailto:support@tradesphere.africa" onClick={() => setIsOpen(false)} className={mobileLink}>
              Support
            </a>
            <div className="my-1 border-t border-slate-100" />
            {user ? (
              <>
                <Link to="/account" onClick={() => setIsOpen(false)} className={mobileLink}>
                  My account
                </Link>
                <LogoutButton className="flex min-h-11 w-full items-center rounded-md px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-emerald-50 disabled:opacity-60" />
              </>
            ) : (
              <>
                <Link to="/signin" onClick={() => setIsOpen(false)} className={mobileLink}>
                  Sign in
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className={mobileLink}>
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