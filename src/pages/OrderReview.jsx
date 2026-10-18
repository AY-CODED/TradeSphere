// src/pages/OrderReview.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle, Clock3, Eye, Flag, MessageCircle, Package, ShieldCheck, Video } from 'lucide-react';
import ProductArt from '../components/ui/ProductArt';
import { approveOrderPacking, createDispute, getMyOrders } from '../api/auth';

const checklistItems = [
  'Correct product and model',
  'Serial number verification',
  'Protective packaging',
  'Shipping label accuracy',
];

const OrderReview = () => {
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [checked, setChecked] = useState([]);
  const [status, setStatus] = useState('');
  const [reporting, setReporting] = useState(false);
  const [issue, setIssue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (order) return;
    getMyOrders()
      .then((orders) => {
        const list = Array.isArray(orders) ? orders : [];
        if (list.length > 0) setOrder(list[list.length - 1]);
      })
      .catch(() => {});
  }, [order]);

  const firstItem = order?.items?.[0] || {
    name: 'Order Package',
    productName: 'Order Package',
    category: 'General',
    quantity: 1,
    sku: 'TS-VERIFIED',
  };

  const productForArt = {
    name: firstItem.productName || firstItem.name || 'Order Item',
    category: firstItem.category || 'General',
    imageUrl: firstItem.imageUrl || '',
  };

  const packingVideoUrl =
    order?.packingVideoUrl ||
    firstItem?.videoUrl ||
    (order?.id && typeof window !== 'undefined' ? localStorage.getItem(`ts_packing_video_${order.id}`) : '');

  const rawVendorName = firstItem.vendorName || 'Verified KuroMart Vendor';
  const cleanVendorName = rawVendorName.includes('@') ? rawVendorName.split('@')[0] : rawVendorName;

  const allChecked = checked.length === checklistItems.length;

  const toggleCheck = (item) =>
    setChecked((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]));

  const handleApprove = async () => {
    if (!order?.id) return;
    setSubmitting(true);
    try {
      const updated = await approveOrderPacking(order.id);
      setOrder(updated);
      setStatus('Packing proof approved in database. Your order has been marked as SHIPPED.');
    } catch (error) {
      setStatus(error.message || 'Unable to approve packing right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitReport = async (event) => {
    event.preventDefault();
    if (!issue.trim()) return;
    setSubmitting(true);
    try {
      await createDispute({
        orderId: order?.id || 'UNKNOWN',
        issue: issue.trim(),
        amount: order?.totalAmount || 0,
        priority: 'High',
      });
      setStatus('Your packing concern was recorded as an active dispute. Your payment remains protected in escrow.');
      setReporting(false);
      setIssue('');
    } catch (error) {
      setStatus(error.message || 'Unable to submit dispute.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-[#f6f8fc] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No order selected for review</h1>
        <p className="mt-2 text-sm text-slate-500">Place an order first to review its packing proof.</p>
        <Link to="/marketplace" className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 font-semibold text-white">
          Browse marketplace
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#f6f8fc]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <Link to="/orders/confirmation" state={{ order }} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-700">
          <ArrowLeft className="h-4 w-4" /> Back to order
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Review your packing proof</h1>
            <p className="mt-2 text-sm text-slate-500">
              Order <strong className="text-green-700">#{order.id}</strong> has been packed and is ready for your review.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-xs font-bold text-green-800">
            <CheckCircle className="h-4 w-4" /> {order.packingApproved ? 'Approved & Shipped' : 'Awaiting your approval'}
            <span className="ml-2 hidden items-center gap-1 text-slate-500 sm:inline-flex">
              <Clock3 className="h-3.5 w-3.5" /> Status: {order.status}
            </span>
          </div>
        </div>

        {status && (
          <p role="status" className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            {status}
          </p>
        )}

        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  {packingVideoUrl ? (
                    <Video className="h-5 w-5 text-green-700" />
                  ) : (
                    <Camera className="h-5 w-5 text-green-700" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {packingVideoUrl ? 'Live vendor packing video proof' : 'High-res photo proof'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Recorded {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Live'}
                    </p>
                  </div>
                </div>
                <span className="rounded-lg bg-green-100 px-3 py-2 text-xs font-bold text-green-800">
                  {packingVideoUrl ? 'Verified Video' : 'Photo · Video'}
                </span>
              </div>
              <div className="relative bg-slate-950">
                {packingVideoUrl ? (
                  <video
                    src={packingVideoUrl}
                    controls
                    className="aspect-[16/9] w-full object-contain"
                  />
                ) : (
                  <ProductArt product={productForArt} className="aspect-[16/9] w-full" />
                )}
                <span className="absolute left-4 top-4 rounded-full bg-green-700 px-3 py-1 text-[10px] font-bold uppercase text-white">
                  Verified packing
                </span>
                {!packingVideoUrl && (
                  <button type="button" className="absolute bottom-4 right-4 rounded-lg bg-white p-3 text-slate-700 shadow" aria-label="View packing photo">
                    <Eye className="h-5 w-5" />
                  </button>
                )}
              </div>
            </section>

            <section className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <ProductArt product={productForArt} className="h-16 w-16 rounded-xl" />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-slate-900">{productForArt.name}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  SKU: {firstItem.sku || 'STD'} · Quantity: {firstItem.quantity || 1}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 px-3 py-2 text-xs">
                <span className="block text-slate-500">Order Reference</span>
                <strong className="text-green-800">#{String(order.id).slice(-8).toUpperCase()}</strong>
              </div>
            </section>

            <div className="mt-4 flex gap-3 rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
              <ShieldCheck className="h-6 w-6 shrink-0 text-teal-700" />
              <div>
                <h2 className="font-bold text-teal-900">Proof-to-door integrity policy</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  If the item delivered does not match the verified packing proof, your escrow payment remains protected while we investigate.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border-t-4 border-green-700 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Approve order</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Confirm that the packing evidence matches what you ordered. Approval releases the order for shipment.
              </p>
              <button
                type="button"
                disabled={!allChecked || submitting || order.packingApproved}
                onClick={handleApprove}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <CheckCircle className="h-4 w-4" /> {order.packingApproved ? 'Already Approved' : 'Looks good, ship it'}
              </button>
              <button
                type="button"
                onClick={() => setReporting((value) => !value)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-orange-200 px-4 py-3 text-sm font-bold text-orange-800 hover:bg-orange-50"
              >
                <Flag className="h-4 w-4" /> Report a problem
              </button>
              {!allChecked && !order.packingApproved && (
                <p className="mt-2 text-center text-xs text-slate-400">Complete the checklist before approving.</p>
              )}
              {reporting && (
                <form onSubmit={submitReport} className="mt-4">
                  <label htmlFor="packing-issue" className="text-xs font-semibold text-slate-700">
                    Describe the issue
                  </label>
                  <textarea
                    id="packing-issue"
                    required
                    value={issue}
                    onChange={(event) => setIssue(event.target.value)}
                    className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-green-600"
                    placeholder="Tell us what looks incorrect..."
                  />
                  <button type="submit" disabled={submitting} className="mt-2 w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white">
                    {submitting ? 'Submitting…' : 'Send report to Dispute Center'}
                  </button>
                </form>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800">
                <CheckCircle className="h-4 w-4 text-green-700" /> Proof checklist
              </h2>
              <div className="mt-4 space-y-4">
                {checklistItems.map((item, index) => (
                  <label key={item} className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" checked={checked.includes(item)} onChange={() => toggleCheck(item)} className="mt-0.5 h-4 w-4 accent-green-700" />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">{item}</span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {[
                          'Model matches your order specs.',
                          'Serial number is clearly visible.',
                          'Protective wrap and corner guards are applied.',
                          'Shipping label matches your address.',
                        ][index]}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">
                  <Package className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{cleanVendorName}</p>
                  <p className="text-xs text-slate-500">Verified marketplace partner</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReporting(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold text-green-800 hover:bg-green-50"
              >
                <MessageCircle className="h-4 w-4" /> Message vendor support
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OrderReview;