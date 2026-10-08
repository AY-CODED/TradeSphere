import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { formatPrice } from '../data/customerProducts';
import { useCart } from '../hooks/useCart';

const deliveryOptions = [
  { id: 'standard', name: 'Standard delivery', detail: '4–7 business days · TradeSphere Verified Logistics', price: 45 },
  { id: 'express', name: 'Express delivery', detail: '2–3 business days · Priority handling', price: 85 },
];

const createOrderId = () => `TS-ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('card');
  const [promo, setPromo] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const navigate = useNavigate();
  const deliveryPrice = deliveryOptions.find((option) => option.id === delivery)?.price || 45;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryPrice + tax;

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#f6f8fc] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Add a product before starting checkout.</p>
        <Link to="/marketplace" className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 font-semibold text-white">Browse marketplace</Link>
      </main>
    );
  }

  const applyPromo = () => {
    setPromoMessage(promo.trim().toUpperCase() === 'TRADE10' ? 'TRADE10 applied. Discount will be confirmed on your invoice.' : 'That promo code is not valid.');
  };

  const placeOrder = (event) => {
    event.preventDefault();
    const order = {
      id: createOrderId(),
      date: new Date().toLocaleDateString(),
      items,
      subtotal,
      delivery: deliveryPrice,
      tax,
      total,
      payment,
      status: 'Payment confirmed',
    };
    localStorage.setItem('tradesphere-customer-last-order', JSON.stringify(order));
    clearCart();
    navigate('/orders/confirmation', { state: { order } });
  };

  return (
    <main className="min-h-[70vh] bg-[#f6f8fc]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <Link to="/cart" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-700"><ArrowLeft className="h-4 w-4" /> Back to cart</Link>
        <h1 className="text-3xl font-bold text-slate-900">Secure checkout</h1>
        <p className="mt-2 text-sm text-slate-500">Complete these steps to finalize your TradeSphere order.</p>
        <ol className="mx-auto my-8 grid max-w-3xl grid-cols-4">
          {['Address', 'Delivery', 'Payment', 'Review'].map((step, index) => <li key={step} className={`relative text-center text-[10px] font-bold uppercase tracking-wide sm:text-xs ${index === 0 ? 'text-green-700' : 'text-slate-400'}`}><span className={`relative z-10 mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full border-2 bg-[#f6f8fc] ${index === 0 ? 'border-green-700 text-green-700' : 'border-slate-300'}`}>{index === 0 ? <MapPin className="h-4 w-4" /> : index === 1 ? <Truck className="h-4 w-4" /> : index === 2 ? <CreditCard className="h-4 w-4" /> : <Check className="h-4 w-4" />}</span>{step}</li>)}
        </ol>

        <form onSubmit={placeOrder} className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-900">Shipping address</h2><p className="mt-1 text-xs text-slate-500">Where should we send your order?</p></div><button type="button" className="text-sm font-bold text-green-700">+ Add new address</button></div>
              <label className="flex cursor-pointer gap-3 rounded-xl border-2 border-green-700 bg-green-50/60 p-4">
                <input type="radio" name="address" defaultChecked className="mt-1 accent-green-700" />
                <span><span className="block font-bold text-slate-900">John Doe <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] uppercase text-green-800">Home</span></span><span className="mt-1 block text-sm text-slate-600">12 Mushin Road, Isolo, Lagos, Lagos State</span><span className="mt-1 block text-xs text-slate-500">+234 801 234 5678</span></span>
              </label>
              <label className="mt-3 flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 hover:border-green-500">
                <input type="radio" name="address" className="mt-1 accent-green-700" />
                <span><span className="block font-bold text-slate-900">John Doe <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase text-slate-600">Office</span></span><span className="mt-1 block text-sm text-slate-600">Plot 45, Victoria Island, Ahmadu Bello Way, Lagos</span><span className="mt-1 block text-xs text-slate-500">+234 809 876 5432</span></span>
              </label>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <h2 className="text-lg font-bold text-slate-900">Delivery method</h2>
              <div className="mt-4 space-y-3">
                {deliveryOptions.map((option) => <label key={option.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${delivery === option.id ? 'border-green-700 bg-green-50/60' : 'border-slate-200'}`}><input type="radio" name="delivery" value={option.id} checked={delivery === option.id} onChange={() => setDelivery(option.id)} className="mt-1 accent-green-700" /><span className="flex-1"><span className="block font-semibold text-slate-900">{option.name}</span><span className="mt-1 block text-xs text-slate-500">{option.detail}</span></span><span className="font-bold text-slate-900">{formatPrice(option.price)}</span></label>)}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <h2 className="text-lg font-bold text-slate-900">Payment method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[['card', 'Credit or debit card', 'Visa, Mastercard'], ['bank', 'Bank transfer', 'Secure bank payment']].map(([value, title, detail]) => <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${payment === value ? 'border-green-700 bg-green-50/60' : 'border-slate-200'}`}><input type="radio" name="payment" value={value} checked={payment === value} onChange={() => setPayment(value)} className="mt-1 accent-green-700" /><span><span className="block font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs text-slate-500">{detail}</span></span></label>)}
              </div>
            </section>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
            <div className="mt-4 space-y-3 border-b border-slate-200 pb-4 text-sm">
              {items.map((item) => <div key={item.id} className="flex justify-between gap-3 text-slate-600"><span className="line-clamp-1">{item.name} × {item.quantity}</span><span className="shrink-0 font-medium text-slate-900">{formatPrice(item.price * item.quantity)}</span></div>)}
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Delivery total</span><span>{formatPrice(deliveryPrice)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Estimated tax</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-4 font-bold text-slate-900"><span>Order total</span><span className="text-xl text-green-700">{formatPrice(total)}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <input value={promo} onChange={(event) => setPromo(event.target.value)} placeholder="Promo code" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-green-600" />
              <button type="button" onClick={applyPromo} className="rounded-lg bg-green-100 px-4 text-sm font-bold text-green-800 hover:bg-green-200">Apply</button>
            </div>
            {promoMessage && <p role="status" className={`mt-2 text-xs ${promoMessage.startsWith('TRADE10') ? 'text-green-700' : 'text-red-600'}`}>{promoMessage}</p>}
            <button type="submit" className="mt-4 w-full rounded-xl bg-green-700 px-4 py-3.5 font-bold text-white transition hover:bg-green-800">Place secure order</button>
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4"><p className="flex items-center gap-2 text-sm font-bold text-green-900"><ShieldCheck className="h-4 w-4" /> 100% safe payment</p><p className="mt-1 text-xs leading-relaxed text-slate-600">Escrow protection keeps your funds secure until delivery is confirmed.</p></div>
            <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Secure SSL checkout</p>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
