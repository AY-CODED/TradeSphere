// src/pages/Marketplace.jsx
import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ChevronDown, Heart, LayoutGrid, List, Package, ShieldCheck, SlidersHorizontal, Star } from 'lucide-react';
import ProductArt from '../components/ui/ProductArt';
import { getProducts } from '../api/auth';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('recommended');
  const [selectedCategories, setSelectedCategories] = useState(() => (categoryParam ? [categoryParam] : []));
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [listView, setListView] = useState(false);
  const [savedProducts, setSavedProducts] = useState([]);
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef(null);
  const { addItem } = useCart();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProducts()
      .then((data) => {
        if (!active) return;
        const available = (Array.isArray(data) ? data : [])
          .filter((item) => Number(item?.stock ?? 0) > 0)
          .map((item) => ({
            ...item,
            vendor: item.vendorName || item.vendor || 'KuroMart Vendor',
            category: item.category || 'General',
            location: item.location || 'Lagos, Nigeria',
            price: Number(item.price || 0),
          }));
        setProducts(available);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSelectedCategories(categoryParam ? [categoryParam] : []);
  }, [categoryParam]);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))],
    [products]
  );

  const vendors = useMemo(
    () => [...new Set(products.map((product) => product.vendor).filter(Boolean))],
    [products]
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.vendor} ${product.category} ${product.description || ''}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesVendor = selectedVendors.length === 0 || selectedVendors.includes(product.vendor);
      return matchesQuery && matchesCategory && matchesVendor;
    });

    if (sort === 'price-low') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, query, selectedCategories, selectedVendors, sort]);

  const toggleCategory = (category) => {
    setSelectedCategories((selected) =>
      selected.includes(category) ? selected.filter((item) => item !== category) : [...selected, category]
    );
  };

  const toggleVendor = (vendor) => {
    setSelectedVendors((selected) =>
      selected.includes(vendor) ? selected.filter((item) => item !== vendor) : [...selected, vendor]
    );
  };

  const toggleSaved = (id) => {
    setSavedProducts((saved) => (saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]));
  };

  const addProduct = (product) => {
    addItem(product);
    setNotice(`${product.name} added to your cart.`);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 2500);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedVendors([]);
    setSearchParams({});
  };

  return (
    <main className="min-h-[70vh] bg-[#f6f8fc]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-green-700">Marketplace / Live Catalogue</p>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{query ? 'Search results' : 'Verified Marketplace'}</h1>
            <p className="mt-2 text-sm text-slate-500">
              <span className="font-semibold text-green-700">{visibleProducts.length}</span> available product(s)
              {query && (
                <>
                  {' '}
                  for <span className="font-medium text-slate-700">“{query}”</span>
                </>
              )}
              <span className="mx-2 text-gray-300">|</span>
              <span className="inline-flex items-center gap-1 text-teal-700">
                <ShieldCheck className="h-4 w-4" /> Buyer protection on every order
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={!listView}
              onClick={() => setListView(false)}
              className={`rounded-lg p-2.5 ${listView ? 'border border-slate-200 bg-white text-slate-500' : 'bg-green-700 text-white'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={listView}
              onClick={() => setListView(true)}
              className={`rounded-lg p-2.5 ${listView ? 'bg-green-700 text-white' : 'border border-slate-200 bg-white text-slate-500'}`}
            >
              <List className="h-4 w-4" />
            </button>
            <label className="ml-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <span className="hidden text-xs font-semibold text-slate-500 sm:inline">Sort:</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent text-sm text-slate-700 outline-none">
                <option value="recommended">Latest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </label>
          </div>
        </div>

        {notice && (
          <div role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            {notice}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-900">
              <SlidersHorizontal className="h-4 w-4 text-green-700" /> Filters
            </div>
            <div className="mb-5 border-b border-slate-100 pb-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-700">Categories</h2>
                <button type="button" onClick={clearFilters} className="text-xs font-semibold text-green-700">
                  Clear all
                </button>
              </div>
              {categories.length === 0 ? (
                <p className="text-xs text-slate-400">No categories yet</p>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 accent-green-700"
                      />
                      {category}
                      <span className="ml-auto text-xs text-slate-400">
                        {products.filter((product) => product.category === category).length}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-5 border-b border-slate-100 pb-5">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-700">Vendors</h2>
              {vendors.length === 0 ? (
                <p className="text-xs text-slate-400">No vendors yet</p>
              ) : (
                vendors.map((vendor) => (
                  <label key={vendor} className="mb-3 flex items-center gap-2.5 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor)}
                      onChange={() => toggleVendor(vendor)}
                      className="h-4 w-4 accent-green-700"
                    />
                    {vendor}
                  </label>
                ))
              )}
            </div>

            <div className="mt-6 rounded-xl bg-slate-900 p-4 text-white">
              <ShieldCheck className="mb-3 h-6 w-6 text-green-400" />
              <p className="text-sm font-bold">KuroMart Verified</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">Verified vendors pass our operational and identity checks.</p>
            </div>
          </aside>

          <section aria-label="Marketplace products">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2].map((n) => (
                  <div key={n} className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white p-5" />
                ))}
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <Package className="mx-auto mb-3 h-10 w-10 text-green-700" />
                <h2 className="text-xl font-bold text-slate-900">No available products found</h2>
                <p className="mt-2 text-sm text-slate-500">
                  {products.length === 0
                    ? 'No vendor has published products with available stock yet.'
                    : 'Try another search or clear your selected filters.'}
                </p>
                {products.length > 0 && (
                  <button type="button" onClick={clearFilters} className="mt-5 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid gap-5 ${listView ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
                {visibleProducts.map((product) => (
                  <article
                    key={product.id}
                    className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg ${
                      listView ? 'flex flex-col sm:flex-row' : 'hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`relative ${listView ? 'sm:w-56 sm:shrink-0' : ''}`}>
                      <Link to={`/products/${product.id}`} aria-label={`View ${product.name}`}>
                        <ProductArt product={product} className={`${listView ? 'h-52 sm:h-full' : 'h-52'} w-full transition-transform duration-300 group-hover:scale-[1.02]`} />
                      </Link>
                      <span className="absolute left-3 top-3 rounded bg-orange-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
                        {product.stock} in stock
                      </span>
                      <button
                        type="button"
                        aria-label={savedProducts.includes(product.id) ? 'Remove from saved items' : 'Save item'}
                        onClick={() => toggleSaved(product.id)}
                        className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 shadow hover:text-rose-600"
                      >
                        <Heart className={`h-4 w-4 ${savedProducts.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>
                    <div className={`flex flex-1 flex-col p-4 ${listView ? 'sm:flex-row sm:items-center sm:gap-6' : ''}`}>
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-green-700">
                          {product.vendor} <Check className="inline h-3 w-3" />
                        </p>
                        <Link to={`/products/${product.id}`} className="line-clamp-2 min-h-10 font-semibold text-slate-900 hover:text-green-700">
                          {product.name}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">{product.category}</p>
                      </div>
                      <div className={`mt-3 flex items-end justify-between ${listView ? 'sm:mt-0 sm:w-52 sm:shrink-0 sm:flex-col sm:items-end sm:gap-2' : ''}`}>
                        <div>
                          <p className="text-xl font-bold text-slate-900">{formatPrice(product.price)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          className="rounded-lg bg-green-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-800"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Marketplace;