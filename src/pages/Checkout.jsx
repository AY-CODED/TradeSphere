
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
  Package,
  LockKeyhole,
  Building2,
  Home,
} from 'lucide-react';

import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const deliveryOptions = [
  {
    id: 'standard',
    name: 'Standard delivery',
    detail: '4–7 business days · KuroMart Verified Logistics',
    price: 45,
  },
  {
    id: 'express',
    name: 'Express delivery',
    detail: '2–3 business days · Priority handling',
    price: 85,
  },
];

const addresses = [
  {
    id: 'home',
    label: 'Home',
    address: '12 Mushin Road, Isolo, Lagos, Lagos State',
    icon: Home,
  },
  {
    id: 'office',
    label: 'Office',
    address: 'Plot 45, Victoria Island, Ahmadu Bello Way, Lagos',
    icon: Building2,
  },
];

const paymentOptions = [
  {
    id: 'card',
    title: 'Debit or credit card',
    detail: 'Visa, Mastercard and supported cards',
    icon: CreditCard,
  },
  {
    id: 'bank',
    title: 'Bank transfer',
    detail: 'Pay securely through Paystack',
    icon: Building2,
  },
];

const Checkout = () => {
  const { items = [], subtotal = 0 } = useCart();
  const { user } = useAuth();

  const accountName =
    user?.fullName || user?.name || user?.email || 'Customer';

  const [shippingAddress, setShippingAddress] = useState('home');
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('card');
  const [promo, setPromo] = useState('');
  const [promoStatus, setPromoStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedAddress = addresses.find(
    (address) => address.id === shippingAddress
  );

  const selectedDelivery = deliveryOptions.find(
    (option) => option.id === delivery
  );

  const deliveryPrice = selectedDelivery?.price ?? 45;
  const tax = Number(subtotal) * 0.05;
  const total = Number(subtotal) + deliveryPrice + tax;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const applyPromo = () => {
    const valid = promo.trim().toUpperCase() === 'TRADE10';

    setPromoStatus({
      valid,
      text: valid
        ? 'Code accepted. Any discount must be confirmed by the server before payment.'
        : 'That promo code is not valid.',
    });
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setErrorMsg('');

    if (!items.length) {
      setErrorMsg('Your cart is empty. Add a product before checkout.');
      return;
    }

    if (!selectedAddress) {
      setErrorMsg('Please select a shipping address.');
      return;
    }

    if (!user?.email) {
      setErrorMsg('Please sign in with your account before making payment.');
      return;
    }

    if (!Number.isFinite(total) || total <= 0) {
      setErrorMsg('Your order total is invalid. Please check your cart.');
      return;
    }

    setSubmitting(true);

    try {
      const pendingOrderPayload = {
        buyerId: user?.id,
        buyerName: accountName,
        shippingAddress: selectedAddress.address,
        deliveryMethod: delivery,
        paymentMethod: payment,
        deliveryFee: deliveryPrice,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      // Save the pending order for the payment-success flow.
      sessionStorage.setItem(
        'pendingOrder',
        JSON.stringify(pendingOrderPayload)
      );

      const apiUrl = (
        import.meta.env.VITE_API_URL || 'http://localhost:8080'
      ).replace(/\/+$/, '');

      const response = await fetch(
        `${apiUrl}/api/v1/payments/initialize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: user.email,
            amount: total,
            callbackUrl: `${window.location.origin}/payment-success`,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error('The payment server returned an invalid response.');
      }

      if (!response.ok || !data?.status) {
        throw new Error(
          data?.message || 'Unable to initialize Paystack payment.'
        );
      }

      const authorizationUrl = data?.data?.authorization_url;

      if (
        typeof authorizationUrl !== 'string' ||
        !authorizationUrl.startsWith('https://')
      ) {
        throw new Error('The payment server returned an invalid payment URL.');
      }

      // Only redirect to a secure payment URL.
      window.location.assign(authorizationUrl);
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : 'Unable to start payment. Please try again.'
      );
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f6f8fc] px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-50 text-green-700">
            <Package size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Add something you love before starting checkout.
          </p>

          <Link
            to="/marketplace"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:w-auto"
          >
            Browse marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f6f8fc]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8 lg:py-12">
        {/* Header */}
        <header className="mb-7 sm:mb-9">
          <Link
            to="/cart"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-green-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700"
          >
            <ArrowLeft size={17} />
            Back to cart
          </Link>

          <div className="mt-5 flex items-start gap-3 sm:mt-6">
            <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-800 sm:grid">
              <LockKeyhole size={23} />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Secure checkout
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Almost yours. Confirm your delivery details and complete your
                KuroMart order.
              </p>
            </div>
          </div>
        </header>

        {/* Checkout progress */}
        <nav
          aria-label="Checkout progress"
          className="mb-7 rounded-2xl border border-slate-200 bg-white px-2 py-4 shadow-sm sm:mb-9 sm:px-6 sm:py-5"
        >
          <ol className="grid grid-cols-4 gap-1 sm:gap-4">
            {[
              { label: 'Address', icon: MapPin },
              { label: 'Delivery', icon: Truck },
              { label: 'Payment', icon: CreditCard },
              { label: 'Review', icon: Check },
            ].map((step, index) => {
              const StepIcon = step.icon;

              return (
                <li
                  key={step.label}
                  className="relative flex min-w-0 flex-col items-center text-center"
                >
                  {index < 3 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[calc(50%+19px)] right-[calc(-50%+19px)] top-4 hidden h-px bg-slate-200 sm:block"
                    />
                  )}

                  <span
                    className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 sm:h-10 sm:w-10 ${
                      index === 0
                        ? 'border-green-700 bg-green-700 text-white'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    <StepIcon size={index === 0 ? 17 : 16} />
                  </span>

                  <span
                    className={`mt-2 text-[10px] font-bold sm:text-xs ${
                      index === 0 ? 'text-green-800' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        {errorMsg && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800"
          >
            <span className="font-bold">!</span>
            <p className="min-w-0 break-words">{errorMsg}</p>
          </div>
        )}

        <form
          onSubmit={handlePlaceOrder}
          className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_390px]"
        >
          {/* Main checkout sections */}
          <div className="min-w-0 space-y-5 sm:space-y-6">
            {/* Shipping address */}
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
              <div className="mb-5 flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-50 text-green-800">
                  <MapPin size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    Shipping address
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    Choose where you want your order delivered.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {addresses.map((address) => {
                  const AddressIcon = address.icon;
                  const selected = shippingAddress === address.id;

                  return (
                    <label
                      key={address.id}
                      className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition sm:gap-4 sm:p-4 ${
                        selected
                          ? 'border-green-700 bg-green-50/70'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingAddress"
                        value={address.id}
                        checked={selected}
                        onChange={() => setShippingAddress(address.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-green-700"
                        aria-label={`Deliver to ${address.label}`}
                      />

                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                          selected
                            ? 'bg-green-100 text-green-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <AddressIcon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="break-words text-sm font-bold text-slate-900 sm:text-base">
                            {accountName}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${
                              selected
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {address.label}
                          </span>
                        </div>

                        <p className="mt-2 break-words text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                          {address.address}
                        </p>
                      </div>

                      {selected && (
                        <Check
                          size={18}
                          className="mt-1 shrink-0 text-green-700"
                          aria-hidden="true"
                        />
                      )}
                    </label>
                  );
                })}
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Need a different address? Add address management to your
                account to save and edit delivery locations.
              </p>
            </section>

            {/* Delivery method */}
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-50 text-green-800">
                  <Truck size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    Delivery method
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Choose the option that suits you.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {deliveryOptions.map((option) => {
                  const selected = delivery === option.id;

                  return (
                    <label
                      key={option.id}
                      className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition sm:gap-4 sm:p-4 ${
                        selected
                          ? 'border-green-700 bg-green-50/70'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={selected}
                        onChange={() => setDelivery(option.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-green-700"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold text-slate-900 sm:text-base">
                          {option.name}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                          {option.detail}
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-bold text-slate-900 sm:text-base">
                        {formatPrice(option.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Payment method */}
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-50 text-green-800">
                  <CreditCard size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    Payment method
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Select your preferred payment option.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {paymentOptions.map((option) => {
                  const PaymentIcon = option.icon;
                  const selected = payment === option.id;

                  return (
                    <label
                      key={option.id}
                      className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition ${
                        selected
                          ? 'border-green-700 bg-green-50/70'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={selected}
                        onChange={() => setPayment(option.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-green-700"
                      />

                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                          selected
                            ? 'bg-green-100 text-green-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <PaymentIcon size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="break-words text-sm font-bold text-slate-900">
                          {option.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {option.detail}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Order summary */}
          <aside className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">
            <div className="border-b border-slate-100 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Order summary
                </h2>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {items.reduce(
                    (count, item) => count + Number(item.quantity || 0),
                    0
                  )}{' '}
                  items
                </span>
              </div>

              <div className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex min-w-0 items-start justify-between gap-3"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-400">
                        <Package size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="break-words text-sm font-medium leading-5 text-slate-700">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-right text-sm font-semibold text-slate-900">
                      {formatPrice(
                        Number(item.price) * Number(item.quantity)
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              {/* Promo code */}
              <div>
                <label
                  htmlFor="promo"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Promo code
                </label>

                <div className="flex min-w-0 gap-2">
                  <input
                    id="promo"
                    type="text"
                    value={promo}
                    onChange={(event) => {
                      setPromo(event.target.value);
                      setPromoStatus(null);
                    }}
                    placeholder="Enter code"
                    autoComplete="off"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={applyPromo}
                    className="min-h-11 shrink-0 rounded-xl bg-green-50 px-3 text-sm font-bold text-green-800 transition hover:bg-green-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:px-4"
                  >
                    Apply
                  </button>
                </div>

                {promoStatus && (
                  <p
                    role="status"
                    className={`mt-2 text-xs leading-5 ${
                      promoStatus.valid
                        ? 'text-green-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {promoStatus.text}
                  </p>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-start justify-between gap-3 text-slate-600">
                  <span>Subtotal</span>
                  <span className="shrink-0 font-medium text-slate-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 text-slate-600">
                  <span>Delivery</span>
                  <span className="shrink-0 font-medium text-slate-900">
                    {formatPrice(deliveryPrice)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 text-slate-600">
                  <span>Estimated tax (5%)</span>
                  <span className="shrink-0 font-medium text-slate-900">
                    {formatPrice(tax)}
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
                <div>
                  <p className="font-bold text-slate-900">Total</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Including delivery and estimated tax
                  </p>
                </div>

                <p className="shrink-0 text-xl font-extrabold tracking-tight text-green-800 sm:text-2xl">
                  {formatPrice(total)}
                </p>
              </div>

              {/* Place order */}
              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Redirecting to Paystack...
                  </>
                ) : (
                  <>
                    <LockKeyhole size={17} />
                    Pay with Paystack
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-slate-500">
                By continuing, you agree to complete payment through our
                secure payment provider.
              </p>

              {/* Security notice */}
              <div className="rounded-xl border border-green-100 bg-green-50/70 p-4">
                <div className="flex items-center gap-2 text-green-900">
                  <ShieldCheck size={19} className="shrink-0" />
                  <p className="text-sm font-bold">Secure checkout</p>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Your payment is processed through Paystack. Payment
                  verification and order confirmation should be completed by
                  your backend before an order is marked as paid.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                <LockKeyhole size={12} />
                Secure payment connection
              </div>
            </div>
          </aside>
        </form>

        {/* Footer reassurance */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-slate-500 sm:mt-10">
          <span className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-green-700" />
            Secure payment
          </span>

          <span className="flex items-center gap-2">
            <Truck size={15} className="text-green-700" />
            Delivery options
          </span>

          <Link
            to="/marketplace"
            className="font-medium transition hover:text-green-700"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
