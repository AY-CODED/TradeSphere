import { Route, Routes } from "react-router-dom";
import PageLayout from "../layout";
import Account from "../../features/account/pages/Account";
import Cart from "../../features/cart/pages/Cart";
import Checkout from "../../features/checkout/pages/Checkout";
import Marketplace from "../../features/marketplace/pages/Marketplace";
import Home from "../../features/marketplace/pages/Home";
import ProductDetails from "../../features/marketplace/pages/ProductDetails";
import BusinessVerification from "../../features/account/pages/BusinessVerification";
import OrderConfirmation from "../../features/orders/pages/OrderConfirmation";
import OrderReview from "../../features/orders/pages/OrderReview";

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
