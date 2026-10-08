import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, ShoppingCart, X } from 'lucide-react';
import Logo from '../assets/images/Logo.png';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/marketplace?q=${encodeURIComponent(query)}` : '/marketplace');
    setIsOpen(false);
  };

  const searchForm = (mobile = false) => (
    <form
      onSubmit={submitSearch}
      className={`relative ${mobile ? 'w-full' : 'hidden max-w-xl flex-1 md:block'}`}
    >
      <Search aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        aria-label="Search products and vendors"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products, vendors, or services..."
        className="w-full rounded-full bg-green-50/70 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-green-600/30"
      />
    </form>
  );

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-4 py-3 md:px-6">
        <Link to="/" aria-label="TradeSphere home" className="shrink-0">
          <img src={Logo} alt="TradeSphere" className="h-8 w-auto object-contain" />
        </Link>

        {searchForm()}

        <div className="hidden shrink-0 items-center gap-6 md:flex">
          <Link to="/marketplace" className={`text-sm font-semibold transition-colors hover:text-green-700 ${location.pathname === '/marketplace' ? 'text-green-700' : 'text-slate-700'}`}>
            Marketplace
          </Link>
          <Link to="/account?section=My%20orders" className="text-sm font-semibold text-slate-700 transition-colors hover:text-green-700">
            Orders
          </Link>
          <a href="mailto:support@tradesphere.africa" className="text-sm font-semibold text-slate-700 transition-colors hover:text-green-700">
            Support
          </a>
          <Link to="/cart" aria-label={`Shopping cart with ${itemCount} items`} className="relative text-slate-500 transition-colors hover:text-green-700">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white">{itemCount}</span>}
          </Link>
          <button type="button" aria-label="Notifications" className="text-slate-500 transition-colors hover:text-green-700">
            <Bell className="h-5 w-5" />
          </button>
          <Link to="/account" className="flex items-center gap-2 border-l border-gray-200 pl-5 text-sm font-medium text-slate-800">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-green-700 text-xs font-bold text-white">JD</span>
            John Doe
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link to="/cart" aria-label={`Shopping cart with ${itemCount} items`} className="relative p-2 text-slate-600">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white">{itemCount}</span>}
          </Link>
          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="p-2 text-slate-600"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-5 border-t border-gray-100 bg-white px-4 pb-5 pt-4 md:hidden">
          {searchForm(true)}
          <div className="flex flex-col gap-4 text-sm font-semibold text-slate-700">
            <Link to="/marketplace" onClick={closeMenu}>Marketplace</Link>
            <Link to="/account?section=My%20orders" onClick={closeMenu}>Orders & tracking</Link>
            <a href="mailto:support@tradesphere.africa" onClick={closeMenu}>Support</a>
            <Link to="/account" onClick={closeMenu} className="flex items-center gap-2 border-t border-gray-100 pt-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-green-700 text-xs font-bold text-white">JD</span>
              John Doe
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
