// src/pages/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle, Heart, Package, Share2, ShieldCheck, ShoppingCart, Truck } from 'lucide-react';
import ProductArt from '../components/ui/ProductArt';
import { getProductById } from '../api/auth';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setQuantity(1);
    setAdded(false);
    setSaved(false);
    setErrorMsg('');
    setLoading(true);

    let active = true;
    getProductById(productId)
      .then((data) => {
        if (!active) return;
        if (!data) {
          setErrorMsg('Product not found.');
          setProduct(null);
          return;
        }
        setProduct({
          ...data,
          vendor: data.vendorName || data.vendor || 'TradeSphere Vendor',
          category: data.category || 'General',
          location: data.location || 'Lagos, Nigeria',
          price: Number(data.price || 0),
          stock: Number(data.stock ?? 0),
        });
      })
      .catch((error) => {
        if (!active) return;
        setErrorMsg(error.message || 'Unable to load product details.');
        setProduct(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#f6f8fc]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="aspect-square animate-pulse rounded-2xl border border-slate-200 bg-white" />
            <div className="space-y-4">
              <div className="h-8 w-1/3 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-12 w-3/4 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-24 w-full animate-pulse rounded-xl bg-white" />
              <div className="h-32 w-full animate-pulse rounded-xl bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (errorMsg || !product) {
    return (
      <main className="min-h-[70vh] bg-[#f6f8fc] px-4 py-16 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Package className="mx-auto mb-3 h-10 w-10 text-green-700" />
          <h1 className="text-xl font-bold text-slate-900">Product unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">{errorMsg || 'This product does not exist or has been removed.'}</p>
          <Link to="/marketplace" className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-800">
            Back to marketplace
          </Link>
        </div>
      </main>
    );
  }

  const inStock = product.stock > 0;

  const addProduct = () => {
    if (!inStock) return;
    addItem(product, quantity);
    setAdded(true);
  };

  const buyNow = () => {
    if (!inStock) return;
    addItem(product, quantity);
    navigate('/cart');
  };

  return (
    <main className="min-h-[70vh] bg-[#f6f8fc]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-green-700">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/marketplace" className="hover:text-green-700">Marketplace</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800">{product.category}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <ProductArt product={product} className="aspect-square w-full sm:aspect-[1.15]" />
              <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase text-white">
                {inStock ? `${product.stock} in stock` : 'Out of stock'}
              </span>
              <button
                type="button"
                aria-label={saved ? 'Remove saved item' : 'Save item'}
                onClick={() => setSaved((value) => !value)}
                className="absolute right-4 top-4 rounded-full bg-white p-2.5 text-slate-600 shadow"
              >
                <Heart className={`h-5 w-5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => (
                <ProductArt
                  key={index}
                  product={product}
                  className={`aspect-square rounded-xl ${index === 0 ? 'ring-2 ring-green-700 ring-offset-2' : 'opacity-70'}`}
                />
              ))}
            </div>
          </div>

          <section>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-green-800">
                  {product.category}
                </span>
                <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-900 md:text-3xl">{product.name}</h1>
                {product.sku && <p className="mt-1 text-xs font-medium text-slate-500">SKU: {product.sku}</p>}
              </div>
              <button type="button" aria-label="Share product" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-500">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-white p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">{formatPrice(product.price)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Tax calculated at checkout for verified business accounts.</p>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">Product details</h2>
                <span className="text-xs text-slate-500">Available: {product.stock} units</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {product.description || 'Verified product listed by a registered TradeSphere supplier.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Business grade', 'Quality checked', 'Escrow protected'].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Quantity</span>
              <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={!inStock || quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="px-3 py-2 text-slate-600 disabled:opacity-40"
                >
                  −
                </button>
                <span className="min-w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={!inStock || quantity >= product.stock}
                  onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                  className="px-3 py-2 text-slate-600 disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <span className={`text-xs font-medium ${inStock ? 'text-green-700' : 'text-rose-600'}`}>
                {inStock ? 'In stock' : 'Out of stock'}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!inStock}
                onClick={buyNow}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Buy now <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={!inStock}
                onClick={addProduct}
                className="flex items-center justify-center gap-2 rounded-xl border border-green-700 bg-white px-5 py-3.5 font-bold text-green-800 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </button>
            </div>
            {added && (
              <p role="status" className="mt-3 text-sm font-medium text-green-700">
                Added to cart. <Link to="/cart" className="underline">View cart</Link>
              </p>
            )}

            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50/60 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-green-700">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-green-900">Buyer protection</p>
                  <p className="text-xs text-slate-600">Funds stay in escrow until delivery is confirmed.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 border-t border-green-200 pt-3 text-xs text-slate-600 sm:grid-cols-2">
                <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-700" /> Verified vendor</p>
                <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-green-700" /> Delivery estimate at checkout</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div>
                <p className="font-bold text-slate-900">{product.vendor}</p>
                <p className="mt-1 text-xs text-slate-500">{product.location} · Verified supplier</p>
              </div>
              <Link to="/marketplace" className="text-xs font-bold text-green-700 hover:underline">
                Visit marketplace
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;