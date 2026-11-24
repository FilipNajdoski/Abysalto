import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites } from '../api/shop.js';
import { getErrorMessage } from '../api/client.js';
import { useShop } from '../context/ShopContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function FavoritesPage() {
  const { favoriteIds } = useShop();
  const [favorites, setFavorites] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getFavorites().then(setFavorites).catch((err) => setError(getErrorMessage(err)));
  }, []);

  const visible = (favorites ?? []).filter((f) => f.product && favoriteIds.has(f.productId));

  return (
    <div>
      <section className="hero">
        <h1>Favorites</h1>
        <p className="muted">Products you saved for later.</p>
      </section>
      {error && <p className="error">{error}</p>}
      {favorites === null && !error ? (
        <div className="product-grid">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton" />)}</div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <p>You haven’t saved anything yet.</p>
          <Link to="/" className="button">Browse products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {visible.map((f) => <ProductCard key={f.productId} product={f.product} />)}
        </div>
      )}
    </div>
  );
}
