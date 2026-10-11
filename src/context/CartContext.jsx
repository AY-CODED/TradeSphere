import { createContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'tradesphere-customer-cart';

const loadCart = () => {
  const savedCart = localStorage.getItem(STORAGE_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
    addItem(product, quantity = 1) {
      setItems((currentItems) => {
        const existing = currentItems.find((item) => item.id === product.id);
        return existing
          ? currentItems.map((item) => item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item)
          : [...currentItems, { ...product, quantity }];
      });
    },
    updateQuantity(id, quantity) {
      setItems((currentItems) => quantity < 1
        ? currentItems.filter((item) => item.id !== id)
        : currentItems.map((item) => item.id === id ? { ...item, quantity } : item));
    },
    removeItem(id) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    },
    clearCart() {
      setItems([]);
    },
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
