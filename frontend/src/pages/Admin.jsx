import { useState, useEffect } from "react";
import api from "../services/api";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", image: "", description: "" });
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [usersRes, productsRes] = await Promise.all([
        api.get("/auth/users"),
        api.get("/products"),
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);

      const cartData = {};
      for (const user of usersRes.data) {
        try {
          const cartRes = await api.get(`/cart/user/${user._id}`);
          cartData[user._id] = cartRes.data;
        } catch {
          cartData[user._id] = { items: [] };
        }
      }
      setCarts(cartData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function saveProduct() {
    const body = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      image: form.image,
      description: form.description,
    };

    if (!body.name || !body.category || isNaN(body.price)) {
      showToast("Please fill in name, category and price!");
      return;
    }

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct}`, body);
        showToast("Product updated!");
      } else {
        await api.post("/products", body);
        showToast("Product added!");
      }
      clearForm();
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      showToast("Failed to save product!");
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      showToast("Product deleted!");
    } catch (err) {
      showToast("Failed to delete!");
    }
  }

  function startEdit(p) {
    setEditingProduct(p._id);
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, image: p.image, description: p.description });
  }

  function clearForm() {
    setEditingProduct(null);
    setForm({ name: "", category: "", price: "", stock: "", image: "", description: "" });
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>Products</button>
        <button className={`tab-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>Users & Carts</button>
      </div>

      {activeTab === "products" && (
        <div className="admin-section">
          <div className="admin-form">
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={saveProduct}>Save Product</button>
              {editingProduct && <button className="btn-secondary" onClick={clearForm}>Cancel</button>}
            </div>
          </div>

          <div className="admin-product-list">
            {products.map(p => (
              <div key={p._id} className="admin-product-item">
                <img src={p.image} alt={p.name} />
                <div className="admin-product-item-info">
                  <h4>{p.name}</h4>
                  <p>{p.category} — ${p.price.toFixed(2)} — Stock: {p.stock}</p>
                </div>
                <div className="admin-product-actions">
                  <button className="btn-edit" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn-delete" onClick={() => deleteProduct(p._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="admin-section">
          {users.map(u => (
            <div key={u._id} className="user-card">
              <div className="user-card-header">
                <div className="user-avatar">{u.name.charAt(0).toUpperCase()}</div>
                <div>
                  <h4>{u.name}</h4>
                  <p>{u.email}</p>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </div>
              </div>
              <div className="user-cart">
                <h5>Cart Items:</h5>
                {carts[u._id]?.items?.length === 0 ? (
                  <p className="empty-text">Empty cart</p>
                ) : (
                  carts[u._id]?.items?.map(item => (
                    <div key={item.product._id} className="user-cart-item">
                      <span>{item.product.name}</span>
                      <span>x{item.quantity}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}