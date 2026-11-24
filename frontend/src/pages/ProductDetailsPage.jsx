import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../api/shop.js';
import { getErrorMessage } from '../api/client.js';
import { useShop } from '../context/ShopContext.jsx';
import { formatPrice, originalPrice } from '../utils/format.js';
import { HeartIcon, StarRating } from '../components/Icons.jsx';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setProduct(null);
    setError('');
    setActiveImage(0);
    setQuantity(1);
    getProduct(id).then(setProduct).catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  if (error) {
    return (
      <div className="empty">
        <p>{error}</p>
        <Link to="/" className="button">Back to shop</Link>
      </div>
    );
  }

  if (!product) {
    return <div className="product-detail"><div className="skeleton tall" /><div className="skeleton tall" /></div>;
  }

  const images = product.images?.length ? product.images : [product.thumbnail];
  const compareAt = originalPrice(product.price, product.discountPercentage);
  const favorite = isFavorite(product.id);
  const maxQuantity = Math.min(product.stock, 100);

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(product.id, quantity);
    setAdding(false);
  };

  return (
    <div>
      <nav className="breadcrumb muted small">
        <Link to="/">Shop</Link> / <span className="capitalize">{product.category}</span> / {product.title}
      </nav>

      <div className="product-detail">
        <div className="gallery">
          <div className="gallery-main">
            <img src={images[activeImage]} alt={product.title} />
          </div>
          {images.length > 1 && (
            <div className="thumbs">
              {images.map((src, i) => (
                <button key={src} type="button" className={`thumb ${i === activeImage ? 'active' : ''}`} onClick={() => setActiveImage(i)}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="buy-box">
          {product.brand && <span className="muted small upper">{product.brand}</span>}
          <h1>{product.title}</h1>
          <StarRating value={product.rating} />
          <div className="price-row large">
            <span className="price">{formatPrice(product.price)}</span>
            {compareAt && <span className="compare">{formatPrice(compareAt)}</span>}
            {product.discountPercentage >= 1 && <span className="badge sale">Save {Math.round(product.discountPercentage)}%</span>}
          </div>
          <p className={`stock ${product.stock > 0 ? 'in' : 'out'}`}>
            {product.stock > 0 ? `In stock · ${product.stock} available` : 'Sold out'}
          </p>

          <div className="purchase">
            <div className="qty">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))} disabled={quantity >= maxQuantity}>+</button>
            </div>
            <button type="button" className="button grow" onClick={handleAdd} disabled={product.stock <= 0 || adding}>
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
            <button
              type="button"
              className={`icon-button bordered ${favorite ? 'active' : ''}`}
              onClick={() => toggleFavorite(product.id)}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HeartIcon filled={favorite} />
            </button>
          </div>

          <p className="description">{product.description}</p>

          {product.tags?.length > 0 && (
            <div className="tags">
              {product.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <section className="reviews">
          <h2>Customer reviews</h2>
          {product.reviews.map((r, i) => (
            <article key={i} className="review">
              <div className="review-head">
                <strong>{r.reviewerName}</strong>
                <StarRating value={r.rating} />
              </div>
              <p>{r.comment}</p>
              <span className="muted small">{new Date(r.date).toLocaleDateString()}</span>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
