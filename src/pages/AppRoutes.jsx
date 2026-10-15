import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import PaymentSuccess from "./PaymentSuccess";
import ProductDetails from "./ProductDetails";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import VendorWorkspace from "./VendorWorkspace";
import AdminDashboard from "./AdminDashboard";
import { useAuth } from "../hooks/useAuth";

const AppRoutes = () => {
  const { status } = useAuth();
  const { pathname } = useLocation();

  // Scroll to the top on every page change (not on query-string changes like marketplace filters)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  if (status === "loading") {
    return (
      <main role="status" aria-live="polite" className="grid min-h-screen place-items-center bg-[#f3f6fb] px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-semibold text-slate-700 shadow-sm">
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
          Connecting To TradeSphere…
        </div>
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/signin" element={<RedirectAuthenticated><SignIn /></RedirectAuthenticated>} />
      <Route path="/signup" element={<RedirectAuthenticated><SignUp /></RedirectAuthenticated>} />
      <Route element={<RequireAuth />}>
        <Route path="/vendor-workspace" element={<VendorWorkspace />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="products/:productId" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route element={<RequireAuth />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
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