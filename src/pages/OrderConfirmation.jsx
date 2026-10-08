import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock3, Download, MapPin, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { formatPrice } from '../data/customerProducts';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order || JSON.parse(localStorage.getItem('tradesphere-customer-last-order') || 'null');

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-[#f6f8fc] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No recent order to show</h1>
        <p className="mt-2 text-sm text-slate-500">Place an order to see its confirmation and delivery updates here.</p>
        <Link to="/marketplace" className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 font-semibold text-white">Browse marketplace</Link>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#f6f8fc]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="grid items-center gap-8 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-[1fr_280px] md:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-green-800"><CheckCircle className="h-4 w-4" /> Transaction successful</span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">Thank you for your order, <span className="text-green-700">John Doe!</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">Order <strong className="text-slate-900">#{order.id}</strong> is confirmed and being processed by your vendor network.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#logistics" className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800">Track my order <ArrowRight className="h-4 w-4" /></a>
              <Link to="/marketplace" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50">Continue shopping</Link>
            </div>
          </div>
          <div className="grid h-44 place-items-center rounded-2xl bg-gradient-to-br from-orange-200 via-orange-300 to-rose-300 text-orange-950">
            <div className="text-center"><PackageCheck className="mx-auto h-20 w-20" strokeWidth={1.2} /><p className="mt-2 text-sm font-bold">Your trade is protected</p></div>
          </div>
        </section>

        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <section id="logistics" className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-900">Logistics status</h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 px-3 py-1 text-xs font-semibold text-green-800"><Clock3 className="h-3.5 w-3.5" /> Estimated delivery: Jun 4–7</span>
              </div>
              <ol className="space-y-5">
                {[
                  { title: 'Order placed', detail: `Order confirmed · ${order.date}`, icon: CheckCircle, complete: true },
                  { title: 'Payment verified', detail: `Payment secured via ${order.payment === 'bank' ? 'bank transfer' : 'card'}`, icon: ShieldCheck, complete: true },
                  { title: 'Vendor confirmation', detail: 'Your suppliers are preparing the items.', icon: PackageCheck, complete: false },
                  { title: 'Out for delivery', detail: 'Tracking details will appear when dispatched.', icon: Truck, complete: false },
                ].map(({ title, detail, icon: Icon, complete }, index) => (
                  <li key={title} className="relative flex gap-4">
                    {index < 3 && <span className={`absolute left-[17px] top-9 h-8 w-px ${complete ? 'bg-green-200' : 'bg-slate-200'}`} />}
                    <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ${complete ? 'bg-green-700 text-white' : 'border border-slate-300 bg-white text-slate-500'}`}><Icon className="h-4 w-4" /></span>
                    <span className="pt-0.5"><strong className="block text-sm text-slate-900">{title}</strong><span className="mt-1 block text-xs text-slate-500">{detail}</span></span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">Package breakdown</h2><span className="text-xs text-slate-500">{order.items.length} line items</span></div>
              <div className="space-y-3">
                {order.items.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"><div className="min-w-0"><p className="font-bold text-slate-900">{item.vendor}</p><p className="mt-1 text-sm text-slate-700">{item.name}</p><p className="mt-1 text-xs text-slate-500">Quantity: {item.quantity} · {item.location}</p></div><span className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</span></article>)}
              </div>
            </section>
            <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-green-700 p-6 text-white sm:flex-row sm:items-center"><ShieldCheck className="h-10 w-10 shrink-0" /><div><h2 className="text-lg font-bold">Your trade is fully protected</h2><p className="mt-1 text-sm leading-relaxed text-green-50">Escrow holds your payment securely. Funds are released after you confirm receipt and inspect your items.</p></div></div>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-bold text-slate-900">Order summary</h2>
              <p className="mt-4 flex justify-between text-sm text-slate-500"><span>Order date</span><strong className="text-slate-800">{order.date}</strong></p>
              <p className="mt-3 flex justify-between text-sm text-slate-500"><span>Payment status</span><strong className="text-green-700">Confirmed</strong></p>
              <p className="mt-3 flex justify-between text-sm text-slate-500"><span>Subtotal</span><span className="text-slate-800">{formatPrice(order.subtotal)}</span></p>
              <p className="mt-2 flex justify-between text-sm text-slate-500"><span>Delivery</span><span className="text-slate-800">{formatPrice(order.delivery)}</span></p>
              <p className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-bold text-slate-900"><span>Grand total</span><span className="text-green-700">{formatPrice(order.total)}</span></p>
              <button type="button" onClick={() => window.print()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" /> Download invoice</button>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-bold text-slate-900">Shipping information</h2>
              <div className="mt-4 flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-green-700" /><div><p className="text-sm font-semibold text-slate-800">John Doe</p><p className="mt-1 text-xs leading-relaxed text-slate-500">12 Mushin Road, Isolo,<br />Lagos State, Nigeria</p></div></div>
              <Link to="/orders/review" className="mt-5 flex items-center justify-between rounded-xl bg-green-50 p-3 text-sm font-bold text-green-800 hover:bg-green-100"><span>Review packing proof</span><ArrowRight className="h-4 w-4" /></Link>
            </section>
            <Link to="/account" className="block rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 hover:border-green-500">View order history and account</Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmation;
