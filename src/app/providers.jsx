import { CartProvider } from "../features/cart/context/CartContext";

const AppProviders = ({ children }) => {
  return <CartProvider>{children}</CartProvider>;
};

export default AppProviders;
