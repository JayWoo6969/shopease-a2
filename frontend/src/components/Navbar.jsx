import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ cartCount, onCartOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">🛍️ ShopEase</Link>
      <div className="nav-links">
        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
            <Link to="/profile" className="nav-link">👤 {user.name}</Link>
            <button className="nav-cart-btn" onClick={onCartOpen}>
              🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}