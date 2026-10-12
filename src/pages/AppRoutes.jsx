import { Navigate, Route, Routes } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import RedirectAuthenticated from "../components/auth/RedirectAuthenticated";
import RequireAuth from "../components/auth/RequireAuth";
import Account from "./Account";
import BusinessVerification from "./BusinessVerification";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Home from "./Home";
import Marketplace from "./Marketplace";
import OrderConfirmation from "./OrderConfirmation";
import OrderReview from "./OrderReview";
import ProductDetails from "./ProductDetails";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useAuth } from "../hooks/useAuth";

const AppRoutes = () => {
  const { status, sessionError, refresh, continueAsGuest } = useAuth();

  if (status === "loading") {
    return (
      <main role="status" aria-live="polite" className="grid min-h-screen place-items-center bg-[#f3f6fb] px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-semibold text-slate-700 shadow-sm">
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
          Checking your TradeSphere session…
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f3f6fb] px-4 py-10">
        <section role="alert" aria-live="polite" className="w-full max-w-lg rounded-2xl border border-rose-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-700">Session check failed</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">We couldn’t connect to your account</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{sessionError}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => refresh().catch(() => {})} className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900">
              Try again
            </button>
            <button type="button" onClick={continueAsGuest} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
              Continue without an account
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/signin" element={<RedirectAuthenticated><SignIn /></RedirectAuthenticated>} />
      <Route path="/signup" element={<RedirectAuthenticated><SignUp /></RedirectAuthenticated>} />
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="products/:productId" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route element={<RequireAuth />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders/confirmation" element={<OrderConfirmation />} />
          <Route path="orders/review" element={<OrderReview />} />
          <Route path="account/verification" element={<BusinessVerification />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
