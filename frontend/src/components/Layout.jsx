import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext.jsx';
import CartDrawer from './CartDrawer.jsx';
import BackToTop from './BackToTop.jsx';
import { BagIcon, HeartIcon } from './Icons.jsx';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const { basket, openCart } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
	setMenuOpen(false);
  }, [location.pathname]);

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
		  <div className={`nav-menu${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)}>
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
		  </div>
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
		  <button
			type="button"
			className="icon-link menu-toggle"
			onClick={() => setMenuOpen((open) => !open)}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
		  >
			<span className={`burger${menuOpen ? ' open' : ''}`} aria-hidden="true"><span /></span>
		  </button>
		</nav>
	  </header>
	  <main className="content">
		<Outlet />
	  </main>
	  <footer className="site-footer muted small">© {new Date().getFullYear()} AbySalto Shop</footer>
	  <CartDrawer />
			<BackToTop />
	</div>
  );
}
