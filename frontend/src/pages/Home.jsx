import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import CartDrawer from "../components/CartDrawer";

export default function Home({ cartOpen, setCartOpen, setCartCount }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const categories = ["All", "Electronics", "Footwear", "Bags", "Lifestyle", "Sports", "Food", "Kitchen"];

  useEffect(() => {
    loadProducts();
    if (user) loadCart();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [search, category, products]);

  async function loadProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
      setError("");
    } catch (err) {
      setError("Could not connect to server.");
    }
    setLoading(false);
  }

  async function loadCart() {
    try {
      const res = await api.get("/cart");
      setCart(res.data || { items: [] });
      setCartCount(res.data?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
    } catch (err) {
      console.error(err);
    }
  }

  function applyFilters() {
    let result = products;
    if (category !== "All") result = result.filter(p => p.category === category);
    if (search) result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }

  async function addToCart(productId) {
    if (!user) { showToast("Please login to add items!"); return; }
    try {
      const res = await api.post("/cart", { productId });
      setCart(res.data);
      setCartCount(res.data?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock: p.stock - 1 } : p));
      showToast("Added to cart!");
    } catch (err) {
      showToast("Failed to add to cart!");
    }
  }

  async function updateQty(productId, qty) {
    if (qty < 1) return removeItem(productId);
    try {
      const res = await api.put(`/cart/${productId}`, { quantity: qty });
      setCart(res.data);
    } catch (err) {
      showToast("Failed to update quantity!");
    }
  }

  async function removeItem(productId) {
    try {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data);
      setCartCount(res.data?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
      showToast("Item removed!");
    } catch (err) {
      showToast("Failed to remove item!");
    }
  }

  async function addBundle() {
    if (!user) { showToast("Please login to add items!"); return; }
    const bundleNames = ["Pringles Can", "Rubber Gloves", "Kitchen Sponge"];
    const bundleItems = products.filter(p => bundleNames.includes(p.name));
    for (const p of bundleItems) {
      await api.post("/cart", { productId: p._id });
    }
    await loadCart();
    showToast("Bundle added to cart! 🎉");
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const bundleProducts = products.filter(p => ["Pringles Can", "Rubber Gloves", "Kitchen Sponge"].includes(p.name));
  const bundleTotal = bundleProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="shop-controls">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {bundleProducts.length === 3 && (
        <div className="bundle-section">
          <div className="bundle-badge">🔥 Popular Bundle</div>
          <h2>Frequently Bought Together</h2>
          <p>Customers who buy Pringles always grab these too!</p>
          <div className="bundle-items">
            {bundleProducts.map((p, i) => (
              <>
                <div key={p._id} className="bundle-item">
                  <img src={p.image} alt={p.name} />
                  <div>
                    <h4>{p.name}</h4>
                    <p>${p.price.toFixed(2)}</p>
                  </div>
                </div>
                {i < bundleProducts.length - 1 && <div className="bundle-plus">+</div>}
              </>
            ))}
          </div>
          <div className="bundle-footer">
            <div className="bundle-total">
              Bundle: <strong>${bundleTotal.toFixed(2)}</strong>
              <span className="original">${(bundleTotal * 1.15).toFixed(2)}</span>
              <span className="save">Save 15%</span>
            </div>
            <button className="bundle-btn" onClick={addBundle}>🛒 Add All 3 to Cart</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="spinner">⏳</div>
      ) : filtered.length === 0 ? (
        <div className="no-results">No products found 😕</div>
      ) : (
        <div className="product-grid">
          {filtered.map(p => {
            const outOfStock = p.stock <= 0;
            const lowStock = p.stock > 0 && p.stock <= 3;
            return (
              <div key={p._id} className="product-card">
                <img src={p.image} alt={p.name} />
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <div className="category">{p.category}</div>
                  <div className="price">${p.price.toFixed(2)}</div>
                  <div className={`stock-badge ${lowStock ? "low" : ""}`}>
                    {outOfStock ? "❌ Out of stock" : lowStock ? `⚠️ Only ${p.stock} left` : "✅ In stock"}
                  </div>
                  <p>{p.description}</p>
                  <button
                    className="add-btn"
                    onClick={() => addToCart(p._id)}
                    disabled={outOfStock}
                  >
                    {outOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        onCheckout={() => { showToast("Order placed! Thanks 🎉"); setCartOpen(false); }}
      />

      {toast && <div className="toast show">{toast}</div>}
    </>
  );
}