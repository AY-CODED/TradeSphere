// src/pages/OrderConfirmation.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock3, Download, MapPin, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { useAuth } from '../hooks/useAuth';
import { getMyOrders } from '../api/auth';

const OrderConfirmation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const accountName = user?.fullName || user?.name || user?.email || 'your account';

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (order) return;
    let active = true;
    getMyOrders()
      .then((orders) => {
        if (!active) return;
        const list = Array.isArray(orders) ? orders : [];
        if (list.length > 0) {
          setOrder(list[list.length - 1]);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [order]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#f6f8fc] px-4 py-16 text-center">
        <p className="text-sm font-semibold text-slate-600">Loading your order confirmation…</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-[#f6f8fc] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No recent order to show</h1>
        <p className="mt-2 text-sm text-slate-500">Place an order to see its confirmation and delivery updates here.</p>
        <Link to="/marketplace" className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 font-semibold text-white">
          Browse marketplace
        </Link>
      </main>
    );
  }

  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date || new Date().toLocaleDateString();
  const orderSubtotal = Number(order.subtotal ?? order.totalAmount ?? 0);
  const orderDelivery = Number(order.deliveryFee ?? order.delivery ?? 45);
  const orderTotal = Number(order.totalAmount ?? order.total ?? orderSubtotal + orderDelivery);

  return (
    <main className="min-h-[70vh] bg-[#f6f8fc]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="grid items-center gap-8 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-[1fr_280px] md:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-green-800">
              <CheckCircle className="h-4 w-4" /> Transaction successful
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Thank you for your order, <span className="text-green-700">{accountName}!</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
              Order <strong className="text-slate-900">#{order.id}</strong> is confirmed in MongoDB and being processed by your vendor network.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#logistics" className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800">
                Track my order <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/marketplace" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50">
                Continue shopping
              </Link>
            </div>
          </div>
          <div className="grid h-44 place-items-center rounded-2xl bg-gradient-to-br from-orange-200 via-orange-300 to-rose-300 text-orange-950">
            <div className="text-center">
              <PackageCheck className="mx-auto h-20 w-20" strokeWidth={1.2} />
              <p className="mt-2 text-sm font-bold">Your trade is protected</p>
            </div>
          </div>
        </section>

        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <section id="logistics" className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-900">Logistics status</h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 px-3 py-1 text-xs font-semibold text-green-800">
                  <Clock3 className="h-3.5 w-3.5" /> Status: {order.status || 'PAID'}
                </span>
              </div>
              <ol className="space-y-5">
                {[
                  { title: 'Order placed', detail: `Order confirmed · ${orderDate}`, icon: CheckCircle, complete: true },
                  { title: 'Payment verified', detail: `Payment secured via ${order.paymentMethod === 'bank' ? 'bank transfer' : 'card'}`, icon: ShieldCheck, complete: true },
                  { title: 'Vendor confirmation', detail: 'Your suppliers are preparing the items.', icon: PackageCheck, complete: Boolean(order.packingApproved) },
                  { title: 'Out for delivery', detail: 'Tracking details appear once packing is approved.', icon: Truck, complete: order.status === 'SHIPPED' },
                ].map(({ title, detail, icon: Icon, complete }, index) => (
                  <li key={title} className="relative flex gap-4">
                    {index < 3 && <span className={`absolute left-[17px] top-9 h-8 w-px ${complete ? 'bg-green-200' : 'bg-slate-200'}`} />}
                    <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ${complete ? 'bg-green-700 text-white' : 'border border-slate-300 bg-white text-slate-500'}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="pt-0.5">
                      <strong className="block text-sm text-slate-900">{title}</strong>
                      <span className="mt-1 block text-xs text-slate-500">{detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Package breakdown</h2>
                <span className="text-xs text-slate-500">{(order.items || []).length} line items</span>
              </div>
              <div className="space-y-3">
                {(order.items || []).map((item, idx) => (
                  <article key={item.productId || item.id || idx} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">{item.vendorName || item.vendor || 'KuroMart Vendor'}</p>
                      <p className="mt-1 text-sm text-slate-700">{item.productName || item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900">{formatPrice(Number(item.price || 0) * Number(item.quantity || 1))}</span>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-bold text-slate-900">Order summary</h2>
              <p className="mt-4 flex justify-between text-sm text-slate-500">
                <span>Order date</span>
                <strong className="text-slate-800">{orderDate}</strong>
              </p>
              <p className="mt-3 flex justify-between text-sm text-slate-500">
                <span>Payment status</span>
                <strong className="text-green-700">{order.status || 'PAID'}</strong>
              </p>
              <p className="mt-3 flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800">{formatPrice(orderSubtotal)}</span>
              </p>
              <p className="mt-2 flex justify-between text-sm text-slate-500">
                <span>Delivery</span>
                <span className="text-slate-800">{formatPrice(orderDelivery)}</span>
              </p>
              <p className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-bold text-slate-900">
                <span>Grand total</span>
                <span className="text-green-700">{formatPrice(orderTotal)}</span>
              </p>
              <button type="button" onClick={() => window.print()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <Download className="h-4 w-4" /> Download invoice
              </button>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-bold text-slate-900">Shipping information</h2>
              <div className="mt-4 flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-green-700" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{accountName}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{order.shippingAddress || 'Standard delivery address'}</p>
                </div>
              </div>
              <Link to="/orders/review" state={{ order }} className="mt-5 flex items-center justify-between rounded-xl bg-green-50 p-3 text-sm font-bold text-green-800 hover:bg-green-100">
                <span>Review packing proof</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
            <Link to="/account?section=My%20orders" className="block rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 hover:border-green-500">
              View order history and account
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmation;