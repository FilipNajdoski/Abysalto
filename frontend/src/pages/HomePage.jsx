import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="card">
      <h2>Welcome{isAuthenticated ? `, ${user.firstName}` : ''}!</h2>
      {isAuthenticated ? (
        <p>You are logged in. Products, favorites and basket are coming next.</p>
      ) : (
        <p>
          Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to continue.
        </p>
      )}
    </div>
  );
}
