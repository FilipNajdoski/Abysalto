import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext.jsx';
import CartDrawer from './CartDrawer.jsx';
import { BagIcon, HeartIcon } from './Icons.jsx';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const { basket, openCart, toast } = useShop();
  const navigate = useNavigate();

  const handleLogout = () => {
	logout();
	navigate('/login');
  };

  return (
	<div className="app">
	  <div className="announcement">Free shipping on orders over $50</div>
	  <header className="navbar">
		<Link to="/" className="brand">AbySalto</Link>
		<nav className="nav-links">
		  <NavLink to="/" end>Shop</NavLink>
		  {isAuthenticated ? (
			<>
			  <NavLink to="/profile">Hi, {user.firstName}</NavLink>
			  <button type="button" className="link-button" onClick={handleLogout}>Log out</button>
			</>
		  ) : (
			<>
			  <NavLink to="/login">Log in</NavLink>
			  <NavLink to="/register">Create account</NavLink>
			</>
		  )}
		  {isAuthenticated && (
			<NavLink to="/favorites" className="icon-link" aria-label="Favorites">
			  <HeartIcon />
			</NavLink>
		  )}
		  <button
			type="button"
			className="icon-link cart-button"
			onClick={() => (isAuthenticated ? openCart() : navigate('/login'))}
			aria-label="Open cart"
		  >
			<BagIcon />
			{basket.totalQuantity > 0 && <span className="cart-count">{basket.totalQuantity}</span>}
		  </button>
		</nav>
	  </header>
	  <main className="content">
		<Outlet />
	  </main>
	  <footer className="site-footer muted small">© {new Date().getFullYear()} AbySalto Shop</footer>
	  <CartDrawer />
	  {toast && <div key={toast.id} className={`toast ${toast.tone}`}>{toast.message}</div>}
	</div>
  );
}
