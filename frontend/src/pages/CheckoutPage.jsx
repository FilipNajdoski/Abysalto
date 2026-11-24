import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { getErrorMessage } from '../api/client.js';
import { formatPrice } from '../utils/format.js';
import { notify } from '../utils/notify.js';

const STEPS = ['Shipping', 'Payment', 'Review', 'Confirmation'];
const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard (5-7 days)', price: 0 },
  { id: 'express', label: 'Express (1-2 days)', price: 14.99 },
];
const TAX_RATE = 0.25;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const digits = (value) => value.replace(/\D/g, '');

const formatCardNumber = (value) =>
  digits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiry = (value, previous) => {
  const d = digits(value).slice(0, 4);
  if (value.length < previous.length && previous.endsWith('/') && d.length === 2) {
    return d.slice(0, 1);
  }
  if (d.length === 1 && Number(d) > 1) return `0${d}/`;
  if (d.length >= 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
};

function validateShipping(s) {
  const errors = {};
  if (!s.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!s.address.trim()) errors.address = 'Address is required.';
  if (!s.city.trim()) errors.city = 'City is required.';
  if (!/^\d{4,6}$/.test(s.postalCode.trim())) errors.postalCode = 'Enter a valid postal code.';
  if (!s.country.trim()) errors.country = 'Country is required.';
  return errors;
}

function validatePayment(p) {
  const errors = {};
  if (!p.cardName.trim()) errors.cardName = 'Name on card is required.';
  if (!/^\d{16}$/.test(digits(p.cardNumber))) errors.cardNumber = 'Card number must have 16 digits.';
  const match = /^(\d{2})\/(\d{2})$/.exec(p.expiry.trim());
  if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) {
    errors.expiry = 'Use MM/YY format.';
  } else {
    const expires = new Date(2000 + Number(match[2]), Number(match[1]));
    if (expires <= new Date()) errors.expiry = 'Card has expired.';
  }
  if (!/^\d{3,4}$/.test(p.cvc.trim())) errors.cvc = 'CVC must have 3-4 digits.';
  return errors;
}

function Field({ label, name, value, onChange, error, ...rest }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} value={value} onChange={onChange} {...rest} />
      {error && <span className="error small">{error}</span>}
    </label>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { basket, clearCart } = useShop();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState(null);
  const [shipping, setShipping] = useState({
    fullName: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    method: 'standard',
  });
  const [payment, setPayment] = useState({ cardName: '', cardNumber: '', expiry: '', cvc: '' });

  if (!order && basket.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const shippingMethod = SHIPPING_METHODS.find((m) => m.id === shipping.method);
  const subtotal = order?.subtotal ?? basket.total;
  const shippingCost = order?.shippingCost ?? shippingMethod.price;
  const tax = order?.tax ?? subtotal * TAX_RATE;
  const total = order?.total ?? subtotal + shippingCost + tax;

  const onShippingChange = (e) => setShipping((s) => ({ ...s, [e.target.name]: e.target.value }));
  const onPaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((p) => {
      if (name === 'cardNumber') return { ...p, cardNumber: formatCardNumber(value) };
      if (name === 'expiry') return { ...p, expiry: formatExpiry(value, p.expiry) };
      if (name === 'cvc') return { ...p, cvc: digits(value).slice(0, 4) };
      return { ...p, [name]: value };
    });
  };

  const next = () => {
    const stepErrors = step === 0 ? validateShipping(shipping) : step === 1 ? validatePayment(payment) : {};
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) setStep((s) => s + 1);
  };

  const back = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const placeOrder = async () => {
    setProcessing(true);
    try {
      await delay(1500);
      if (digits(payment.cardNumber).endsWith('0000')) {
        throw new Error('Payment declined by the bank (simulated).');
      }
      const snapshot = {
        number: `AS-${Date.now().toString().slice(-8)}`,
        items: basket.items,
        subtotal,
        shippingCost,
        tax,
        total,
        cardLast4: digits(payment.cardNumber).slice(-4),
      };
      await clearCart();
      setOrder(snapshot);
      setStep(3);
      notify.success('Payment successful. Order placed!');
    } catch (error) {
      notify.error(error instanceof Error && !error.response ? error.message : getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  const items = order?.items ?? basket.items;

  return (
    <div>
      <section className="hero">
        <h1>Checkout</h1>
        <p className="muted small">This is a simulated checkout. No real payment is processed.</p>
      </section>

      <ol className="checkout-steps">
        {STEPS.map((label, index) => (
          <li key={label} className={index === step ? 'active' : index < step ? 'done' : ''}>
            <span className="step-index">{index < step ? '✓' : index + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      <div className="cart-layout">
        <div className="card">
          {step === 0 && (
            <div className="checkout-form">
              <h3>Shipping address</h3>
              <Field label="Full name" name="fullName" value={shipping.fullName} onChange={onShippingChange} error={errors.fullName} />
              <Field label="Address" name="address" value={shipping.address} onChange={onShippingChange} error={errors.address} />
              <div className="field-row">
                <Field label="City" name="city" value={shipping.city} onChange={onShippingChange} error={errors.city} />
                <Field label="Postal code" name="postalCode" value={shipping.postalCode} onChange={onShippingChange} error={errors.postalCode} />
              </div>
              <Field label="Country" name="country" value={shipping.country} onChange={onShippingChange} error={errors.country} />
              <h3>Shipping method</h3>
              {SHIPPING_METHODS.map((m) => (
                <label key={m.id} className="radio">
                  <input type="radio" name="method" value={m.id} checked={shipping.method === m.id} onChange={onShippingChange} />
                  {m.label} — {m.price === 0 ? 'Free' : formatPrice(m.price)}
                </label>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="checkout-form">
              <h3>Payment details</h3>
              <p className="muted small">Use any 16-digit number. Numbers ending in 0000 simulate a declined payment.</p>
              <Field label="Name on card" name="cardName" value={payment.cardName} onChange={onPaymentChange} error={errors.cardName} />
              <Field label="Card number" name="cardNumber" value={payment.cardNumber} onChange={onPaymentChange} error={errors.cardNumber} placeholder="4242 4242 4242 4242" inputMode="numeric" autoComplete="off" maxLength={19} />
              <div className="field-row">
                <Field label="Expiry" name="expiry" value={payment.expiry} onChange={onPaymentChange} error={errors.expiry} placeholder="MM/YY" inputMode="numeric" autoComplete="off" maxLength={5} />
                <Field label="CVC" name="cvc" value={payment.cvc} onChange={onPaymentChange} error={errors.cvc} placeholder="123" inputMode="numeric" autoComplete="off" maxLength={4} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-form">
              <h3>Review your order</h3>
              <p>
                <strong>Ship to:</strong> {shipping.fullName}, {shipping.address}, {shipping.postalCode} {shipping.city}, {shipping.country}
              </p>
              <p><strong>Shipping:</strong> {shippingMethod.label}</p>
              <p><strong>Payment:</strong> Card ending in {digits(payment.cardNumber).slice(-4)}</p>
            </div>
          )}

          {step === 3 && order && (
            <div className="checkout-form">
              <h3>Thank you for your order!</h3>
              <p>Order number: <strong>{order.number}</strong></p>
              <p>A confirmation would be sent to {user?.email ?? 'your email'}. Paid with card ending in {order.cardLast4}.</p>
              <Link to="/" className="button">Continue shopping</Link>
            </div>
          )}

          {step < 3 && (
            <div className="checkout-actions">
              {step === 0 ? (
                <Link to="/cart" className="link-button">← Back to cart</Link>
              ) : (
                <button type="button" className="link-button" onClick={back} disabled={processing}>← Back</button>
              )}
              {step < 2 ? (
                <button type="button" className="button" onClick={next}>Continue</button>
              ) : (
                <button type="button" className="button" onClick={placeOrder} disabled={processing}>
                  {processing ? 'Processing payment…' : `Pay ${formatPrice(total)}`}
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="card summary">
          <h3>Order summary</h3>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.productId}>
                <span>{item.quantity} × {item.title}</span>
                <span>{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="subtotal"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="subtotal"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span></div>
          <div className="subtotal"><span>Tax (25%)</span><span>{formatPrice(tax)}</span></div>
          <div className="subtotal"><span>Total</span><strong>{formatPrice(total)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
