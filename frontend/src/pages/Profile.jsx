import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cart")
      .then(res => setCart(res.data || { items: [] }))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const total = cart.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className={`role-badge ${user?.role}`}>{user?.role}</span>
          </div>
        </div>

        <div className="profile-section">
          <h3>Your Current Cart</h3>
          {loading ? (
            <p>Loading...</p>
          ) : cart.items?.length === 0 ? (
            <p className="empty-text">Your cart is empty</p>
          ) : (
            <>
              {cart.items.map(item => (
                <div key={item.product._id} className="profile-cart-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="profile-cart-info">
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="profile-cart-subtotal">
                    ${(item.quantity * item.product.price).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="profile-cart-total">Total: ${total.toFixed(2)}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}