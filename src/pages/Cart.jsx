import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Heart, ShieldCheck, Store, Trash2, Truck } from 'lucide-react';
import ProductArt from '../components/ProductArt';
import { formatPrice } from '../data/customerProducts';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const vendors = [...new Set(items.map((item) => item.vendor))];

  return (
    <main className="min-h-[70vh] bg-[#f6f8fc]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <Link to="/marketplace" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-green-700"><ArrowLeft className="h-4 w-4" /> Continue shopping</Link>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Shopping cart</h1>
            <p className="mt-1 text-sm text-slate-500">{items.reduce((total, item) => total + item.quantity, 0)} items from {vendors.length} verified {vendors.length === 1 ? 'vendor' : 'vendors'}</p>
          </div>
          {items.length > 0 && <Link to="/marketplace" className="hidden text-sm font-semibold text-green-700 hover:underline sm:block">Browse more products</Link>}
        </div>

        {items.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-50 text-green-700"><Store className="h-7 w-7" /></div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">Your cart is waiting for good finds</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Browse verified African suppliers and add products to start a secure order.</p>
            <Link to="/marketplace" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800">Explore marketplace <ArrowRight className="h-4 w-4" /></Link>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              {vendors.map((vendor) => {
                const vendorItems = items.filter((item) => item.vendor === vendor);
                return (
                  <section key={vendor} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-green-50/70 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl border border-green-100 bg-white text-green-700"><Store className="h-5 w-5" /></span>
                        <div><p className="font-bold uppercase tracking-wide text-slate-800">{vendor}</p><p className="text-[10px] font-semibold uppercase text-slate-500">Verified supplier · Ships from Africa</p></div>
                      </div>
                      <span className="rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-semibold text-green-800">Est. 2–5 business days</span>
                    </header>
                    <div className="divide-y divide-slate-100">
                      {vendorItems.map((item) => (
                        <article key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                          <Link to={`/products/${item.id}`} className="shrink-0"><ProductArt product={item} className="h-28 w-full rounded-xl sm:w-28" /></Link>
                          <div className="min-w-0 flex-1">
                            <Link to={`/products/${item.id}`} className="font-bold text-slate-900 hover:text-green-700">{item.name}</Link>
                            <p className="mt-1 text-xs text-slate-500">{item.category} · ships from {item.location}</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-teal-700"><ShieldCheck className="h-3.5 w-3.5" /> Escrow protected</p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <div className="flex items-center rounded-lg border border-slate-200">
                                <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1.5 text-slate-600">−</button>
                                <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1.5 text-slate-600">+</button>
                              </div>
                              <button type="button" aria-label={`Save ${item.name}`} className="text-slate-400 hover:text-rose-600"><Heart className="h-4 w-4" /></button>
                              <button type="button" onClick={() => removeItem(item.id)} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-slate-900 sm:self-start">{formatPrice(item.price * item.quantity)}</p>
                        </article>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500"><Truck className="h-4 w-4 text-teal-700" /> TradeSphere Verified Logistics coordinates your fulfillment.</div>
                  </section>
                );
              })}
              {vendors.length > 1 && <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4 text-sm text-orange-900"><strong>Multi-vendor delivery:</strong> Your items ship from different regional hubs. Separate tracking and delivery windows may apply.</div>}
            </div>

            <aside className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-slate-600"><span>Logistics estimate</span><span className="font-semibold text-slate-900">{formatPrice(45)}</span></div>
                <div className="flex justify-between text-slate-600"><span>Estimated tax</span><span className="font-semibold text-slate-900">{formatPrice(subtotal * 0.05)}</span></div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-baseline justify-between"><span className="font-bold text-slate-900">Grand total</span><span className="text-2xl font-extrabold text-green-700">{formatPrice(subtotal + 45 + subtotal * 0.05)}</span></div>
                  <p className="mt-1 text-right text-[10px] text-slate-400">Includes marketplace service fee</p>
                </div>
              </div>
              <Link to="/checkout" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3.5 font-bold text-white shadow-sm transition hover:bg-green-800">Proceed to checkout <ArrowRight className="h-4 w-4" /></Link>
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500"><ShieldCheck className="h-4 w-4 text-green-700" /> Secure payment protected by escrow</div>
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-green-800">TradeSphere escrow</p><p className="mt-1 text-xs leading-relaxed text-slate-600">Your payment is held securely and only released after you confirm receipt.</p></div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
