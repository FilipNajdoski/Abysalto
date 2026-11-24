import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function CartDrawer() {
  const { basket, cartOpen, closeCart, removeFromCart, updateQuantity } = useShop();

  return (
    <>
      <div className={`overlay ${cartOpen ? 'show' : ''}`} onClick={closeCart} />
      <aside className={`drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <header className="drawer-header">
          <h3>Your cart ({basket.totalQuantity})</h3>
          <button type="button" className="icon-button" onClick={closeCart} aria-label="Close cart">✕</button>
        </header>
        {basket.items.length === 0 ? (
          <div className="drawer-empty">
            <p>Your cart is empty.</p>
            <Link to="/" className="button" onClick={closeCart}>Continue shopping</Link>
          </div>
        ) : (
          <>
            <ul className="cart-lines">
              {basket.items.map((item) => (
                <li key={item.productId} className="cart-line">
                  <img src={item.thumbnail} alt={item.title} />
                  <div>
                    <Link to={`/products/${item.productId}`} onClick={closeCart} className="cart-title">{item.title}</Link>
                    <span className="muted small">{formatPrice(item.unitPrice)} each</span>
                    <div className="qty small">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button type="button" className="link-button danger small" onClick={() => removeFromCart(item.productId)}>
                      Remove
                    </button>
                  </div>
                  <strong>{formatPrice(item.lineTotal)}</strong>
                </li>
              ))}
            </ul>
            <footer className="drawer-footer">
              <div className="subtotal">
                <span>Subtotal</span>
                <strong>{formatPrice(basket.total)}</strong>
              </div>
              <Link to="/cart" className="button full" onClick={closeCart}>View cart</Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
