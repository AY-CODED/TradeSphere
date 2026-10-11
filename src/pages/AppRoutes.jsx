import { Route, Routes } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Account from "./Account";
import BusinessVerification from "./BusinessVerification";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Home from "./Home";
import Marketplace from "./Marketplace";
import OrderConfirmation from "./OrderConfirmation";
import OrderReview from "./OrderReview";
import ProductDetails from "./ProductDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="products/:productId" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders/confirmation" element={<OrderConfirmation />} />
        <Route path="orders/review" element={<OrderReview />} />
        <Route path="account/verification" element={<BusinessVerification />} />
        <Route path="account" element={<Account />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
