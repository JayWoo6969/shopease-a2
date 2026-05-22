export default function CartDrawer({ cart, open, onClose, onUpdateQty, onRemove, onCheckout }) {
  const items = cart?.items || [];
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <>
      <div className={`cart-overlay ${open ? "active" : ""}`} onClick={onClose} />
      <div className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart" onClick={onClose}>✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">Your cart is empty 🛒</div>
          ) : (
            items.map(item => (
              <div key={item.product._id} className="cart-item">
                <img src={item.product.image} alt={item.product.name} />
                <div className="cart-item-info">
                  <h4>{item.product.name}</h4>
                  <p>${item.product.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => onUpdateQty(item.product._id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => onUpdateQty(item.product._id, item.quantity + 1)}>+</button>
                  <button className="remove-btn" onClick={() => onRemove(item.product._id)}>🗑</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">Total: ${total.toFixed(2)}</div>
          <button className="checkout-btn" onClick={onCheckout}>Checkout</button>
        </div>
      </div>
    </>
  );
}