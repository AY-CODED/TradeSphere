import { CartProvider } from "./CartContext";
import { ThemeProvider } from "./ThemeProvider";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
