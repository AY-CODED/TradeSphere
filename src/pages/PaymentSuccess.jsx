// src/pages/PaymentSuccess.jsx
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { placeOrder as createOrderApi, verifyPayment, recordPayment } from "../api/auth";
import { useCart } from "../hooks/useCart";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("verifying");
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const reference = searchParams.get("reference") || searchParams.get("trxref");
    if (!reference) {
      setStatus("failed");
      return;
    }

    const verifyAndCreateOrder = async () => {
      try {
        const data = await verifyPayment(reference);

        if (data?.status && data?.data?.status === "success") {
          const pendingOrderRaw = sessionStorage.getItem("pendingOrder");
          if (pendingOrderRaw) {
            const orderPayload = JSON.parse(pendingOrderRaw);
            const savedOrder = await createOrderApi(orderPayload);

            const vendorIds = Array.from(
              new Set((savedOrder?.items || []).map((i) => i.vendorId).filter(Boolean))
            );

            await recordPayment({
              orderId: savedOrder.id,
              buyerId: savedOrder.buyerId || orderPayload.buyerId,
              buyerName: savedOrder.buyerName || orderPayload.buyerName,
              vendorIds,
              amount: savedOrder.totalAmount || (data.data.amount / 100),
              paymentMethod: orderPayload.paymentMethod || "card",
              transactionReference: reference,
            }).catch(() => {});

            sessionStorage.removeItem("pendingOrder");
            clearCart();
            navigate("/orders/confirmation", { state: { order: savedOrder }, replace: true });
            return;
          }
          clearCart();
          navigate("/orders/confirmation", { replace: true });
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };

    verifyAndCreateOrder();
  }, [searchParams, navigate, clearCart]);

  return (
    <main className="grid min-h-[70vh] place-items-center bg-[#f6f8fc] px-4 py-16 text-center">
      {status === "verifying" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Verifying your payment…</h1>
          <p className="mt-2 text-sm text-slate-500">Please wait while we confirm your transaction with Paystack.</p>
        </div>
      )}

      {status === "failed" && (
        <div className="rounded-2xl border border-rose-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-rose-600">Payment Verification Failed</h1>
          <p className="mt-2 text-sm text-slate-500">We could not confirm your payment. Please try again.</p>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-5 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white hover:bg-green-800"
          >
            Return to Checkout
          </button>
        </div>
      )}
    </main>
  );
}