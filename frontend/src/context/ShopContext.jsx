import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { getErrorMessage } from '../api/client.js';
import * as shop from '../api/shop.js';
import { notify } from '../utils/notify.js';

const ShopContext = createContext(null);
const EMPTY_BASKET = { items: [], totalQuantity: 0, total: 0, updatedAt: null };

const titleOf = (basket, productId) =>
  basket.items.find((i) => i.productId === productId)?.title ?? 'Product';

export function ShopProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [basket, setBasket] = useState(EMPTY_BASKET);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [cartOpen, setCartOpen] = useState(false);

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
    notify.info('Please log in to continue.');
    navigate('/login');
    return false;
  }, [isAuthenticated, navigate]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!requireAuth()) return;
      try {
        const updated = await shop.addBasketItem(productId, quantity);
        setBasket(updated);
        setCartOpen(true);
        notify.success(`${titleOf(updated, productId)} added to cart`);
      } catch (error) {
        notify.error(getErrorMessage(error));
      }
    },
    [requireAuth],
  );

  const removeFromCart = useCallback(
    async (productId) => {
      const title = titleOf(basket, productId);
      try {
        setBasket(await shop.removeBasketItem(productId));
        notify.info(`${title} removed from cart`);
      } catch (error) {
        notify.error(getErrorMessage(error));
      }
    },
    [basket],
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }
      const previous = basket.items.find((i) => i.productId === productId)?.quantity ?? 0;
      try {
        const updated = await shop.setBasketItemQuantity(productId, quantity);
        setBasket(updated);
        const title = titleOf(updated, productId);
        notify.success(
          quantity > previous
            ? `Increased ${title} to ${quantity}`
            : `Decreased ${title} to ${quantity}`,
        );
      } catch (error) {
        notify.error(getErrorMessage(error));
      }
    },
    [basket, removeFromCart],
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
        if (isFavorite) notify.info('Removed from favorites');
        else notify.success('Saved to favorites');
      } catch (error) {
        notify.error(getErrorMessage(error));
      }
    },
    [favoriteIds, requireAuth],
  );

  const value = useMemo(
    () => ({
      basket,
      favoriteIds,
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleFavorite,
      isFavorite: (id) => favoriteIds.has(id),
    }),
    [basket, favoriteIds, cartOpen, addToCart, removeFromCart, updateQuantity, toggleFavorite],
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
