import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { getErrorMessage } from '../api/client.js';
import * as shop from '../api/shop.js';

const ShopContext = createContext(null);
const EMPTY_BASKET = { items: [], totalQuantity: 0, total: 0, updatedAt: null };

export function ShopProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [basket, setBasket] = useState(EMPTY_BASKET);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, tone = 'info') => {
    setToast({ message, tone, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!isAuthenticated) {
      setBasket(EMPTY_BASKET);
      setFavoriteIds(new Set());
      return;
    }
    shop.getBasket().then(setBasket).catch(() => {});
    shop
      .getFavorites()
      .then((items) => setFavoriteIds(new Set(items.map((f) => f.productId))))
      .catch(() => {});
  }, [isAuthenticated]);

  const requireAuth = useCallback(() => {
    if (isAuthenticated) return true;
    navigate('/login');
    return false;
  }, [isAuthenticated, navigate]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!requireAuth()) return;
      try {
        setBasket(await shop.addBasketItem(productId, quantity));
        setCartOpen(true);
      } catch (error) {
        notify(getErrorMessage(error), 'error');
      }
    },
    [requireAuth, notify],
  );

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        setBasket(await shop.removeBasketItem(productId));
      } catch (error) {
        notify(getErrorMessage(error), 'error');
      }
    },
    [notify],
  );

  const toggleFavorite = useCallback(
    async (productId) => {
      if (!requireAuth()) return;
      const isFavorite = favoriteIds.has(productId);
      try {
        if (isFavorite) {
          await shop.removeFavorite(productId);
        } else {
          await shop.addFavorite(productId);
        }
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (isFavorite) next.delete(productId);
          else next.add(productId);
          return next;
        });
        notify(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
      } catch (error) {
        notify(getErrorMessage(error), 'error');
      }
    },
    [favoriteIds, requireAuth, notify],
  );

  const value = useMemo(
    () => ({
      basket,
      favoriteIds,
      cartOpen,
      toast,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      addToCart,
      removeFromCart,
      toggleFavorite,
      isFavorite: (id) => favoriteIds.has(id),
    }),
    [basket, favoriteIds, cartOpen, toast, addToCart, removeFromCart, toggleFavorite],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
}
