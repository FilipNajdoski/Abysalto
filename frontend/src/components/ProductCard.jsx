import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { formatPrice, originalPrice } from '../utils/format.js';
import { HeartIcon, StarRating } from './Icons.jsx';

export default function ProductCard({ product }) {
  const { isFavorite, toggleFavorite, addToCart } = useShop();
  const favorite = isFavorite(product.id);
  const compareAt = originalPrice(product.price, product.discountPercentage);
  const outOfStock = product.stock <= 0;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-media">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        {product.discountPercentage >= 10 && (
          <span className="badge sale">-{Math.round(product.discountPercentage)}%</span>
        )}
      </Link>
      <button
        type="button"
        className={`icon-button fav ${favorite ? 'active' : ''}`}
        onClick={() => toggleFavorite(product.id)}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <HeartIcon filled={favorite} />
      </button>
      <div className="product-info">
        {product.brand && <span className="muted small">{product.brand}</span>}
        <Link to={`/products/${product.id}`} className="product-title">{product.title}</Link>
        <StarRating value={product.rating} />
        <div className="price-row">
          <span className="price">{formatPrice(product.price)}</span>
          {compareAt && <span className="compare">{formatPrice(compareAt)}</span>}
        </div>
        <button
          type="button"
          className="button secondary full"
          disabled={outOfStock}
          onClick={() => addToCart(product.id, 1)}
        >
          {outOfStock ? 'Sold out' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}
