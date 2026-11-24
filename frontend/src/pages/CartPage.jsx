import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function CartPage() {
  const { basket, addToCart, removeFromCart } = useShop();

  if (basket.items.length === 0) {
    return (
      <div className="empty">
        <h1>Your cart is empty</h1>
        <Link to="/" className="button">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <section className="hero">
        <h1>Your cart</h1>
      </section>
      <div className="cart-layout">
        <div className="card flush">
          <ul className="cart-lines large">
            {basket.items.map((item) => (
              <li key={item.productId} className="cart-line">
                <img src={item.thumbnail} alt={item.title} />
                <div>
                  <Link to={`/products/${item.productId}`} className="cart-title">{item.title}</Link>
                  <span className="muted small">{formatPrice(item.unitPrice)} each</span>
                  <div className="qty small">
                    <button type="button" onClick={() => removeFromCart(item.productId)} aria-label="Remove item">🗑</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => addToCart(item.productId, 1)} aria-label="Add one more">+</button>
                  </div>
                </div>
                <strong>{formatPrice(item.lineTotal)}</strong>
              </li>
            ))}
          </ul>
        </div>
        <aside className="card summary">
          <h3>Order summary</h3>
          <div className="subtotal">
            <span>Items</span>
            <span>{basket.totalQuantity}</span>
          </div>
          <div className="subtotal">
            <span>Subtotal</span>
            <strong>{formatPrice(basket.total)}</strong>
          </div>
          <p className="muted small">Taxes and shipping calculated at checkout.</p>
          <button type="button" className="button full" disabled title="Checkout is out of scope">
            Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
