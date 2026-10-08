import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle, Heart, Share2, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import ProductArt from '../components/ProductArt';
import { customerProducts, formatPrice } from '../data/customerProducts';
import { useCart } from '../hooks/useCart';

const ProductDetails = () => {
  const { productId } = useParams();
  const product = customerProducts.find((item) => item.id === productId) || customerProducts[0];
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const addProduct = () => {
    addItem(product, quantity);
    setAdded(true);
  };

  const buyNow = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  return (
    <main className="min-h-[70vh] bg-[#f6f8fc]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-green-700">Home</Link><span className="mx-2">›</span>
          <Link to="/marketplace" className="hover:text-green-700">Marketplace</Link><span className="mx-2">›</span>
          <span className="text-slate-800">{product.category}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <ProductArt product={product} className="aspect-square w-full sm:aspect-[1.15]" />
              <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase text-white">Verified quality</span>
              <button type="button" aria-label={saved ? 'Remove saved item' : 'Save item'} onClick={() => setSaved((value) => !value)} className="absolute right-4 top-4 rounded-full bg-white p-2.5 text-slate-600 shadow">
                <Heart className={`h-5 w-5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => <ProductArt key={index} product={product} className={`aspect-square rounded-xl ${index === 0 ? 'ring-2 ring-green-700 ring-offset-2' : 'opacity-70'}`} />)}
            </div>
          </div>

          <section>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-green-800">{product.category}</span>
                <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-900 md:text-3xl">{product.name}</h1>
              </div>
              <button type="button" aria-label="Share product" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-500"><Share2 className="h-4 w-4" /></button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="flex items-center gap-1 text-orange-500"><Star className="h-4 w-4 fill-current" /><strong>{product.rating}</strong></span>
              <span className="text-slate-400">({product.reviews} reviews)</span>
              <span className="text-slate-300">|</span><span className="text-green-700">{product.stock * 100}+ sold</span>
            </div>
            <div className="mt-5 rounded-xl bg-white p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">{formatPrice(product.price)}</span>
                {product.previousPrice && <span className="text-sm text-slate-400 line-through">{formatPrice(product.previousPrice)}</span>}
                {product.previousPrice && <span className="rounded bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700">SPECIAL PRICE</span>}
              </div>
              <p className="mt-1 text-xs text-slate-500">Tax calculated at checkout for verified business accounts.</p>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">Product details</h2>
                <span className="text-xs text-slate-500">Available: {product.stock} units</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Business grade', 'Quality checked', 'Bulk pricing available'].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">{item}</span>)}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Quantity</span>
              <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-3 py-2 text-slate-600">−</button>
                <span className="min-w-8 text-center text-sm font-semibold">{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} className="px-3 py-2 text-slate-600">+</button>
              </div>
              <span className="text-xs font-medium text-green-700">In stock</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={buyNow} className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 font-bold text-white transition hover:bg-green-800">Buy now <ArrowRight className="h-4 w-4" /></button>
              <button type="button" onClick={addProduct} className="flex items-center justify-center gap-2 rounded-xl border border-green-700 bg-white px-5 py-3.5 font-bold text-green-800 transition hover:bg-green-50"><ShoppingCart className="h-4 w-4" /> Add to cart</button>
            </div>
            {added && <p role="status" className="mt-3 text-sm font-medium text-green-700">Added to cart. <Link to="/cart" className="underline">View cart</Link></p>}

            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50/60 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-green-700"><ShieldCheck className="h-5 w-5" /></span>
                <div><p className="text-sm font-bold text-green-900">Buyer protection</p><p className="text-xs text-slate-600">Funds stay in escrow until delivery is confirmed.</p></div>
              </div>
              <div className="mt-4 grid gap-2 border-t border-green-200 pt-3 text-xs text-slate-600 sm:grid-cols-2">
                <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-700" /> Verified vendor</p>
                <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-green-700" /> Delivery estimate at checkout</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div><p className="font-bold text-slate-900">{product.vendor}</p><p className="mt-1 text-xs text-slate-500">{product.location} · Verified supplier</p></div>
              <Link to="/marketplace" className="text-xs font-bold text-green-700 hover:underline">Visit marketplace</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
