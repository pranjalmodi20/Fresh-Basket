import React, { useState } from 'react';
import './AdminPanel.css';

const emptyForm = {
  name: '',
  price: '',
  category: '',
  description: '',
  imageUrls: '',
  inStock: true,
};

const AdminPanel = ({ products, onRefresh }) => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || '',
      imageUrls: product.imageUrl || '',
      inStock: product.inStock,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const body = {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        imageUrl: form.imageUrls.trim(), // single URL for now
        inStock: form.inStock,
      };

      const endpoint = editingId
        ? `/api/products/${editingId}`
        : '/api/products';

      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(`http://localhost:5001${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Save product error:', data);
        alert(data.message || 'Error saving product');
      } else {
        resetForm();
        onRefresh(); // reload products
      }
    } catch (err) {
      console.error('Save product error:', err);
      alert('Network error while saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5001/api/products/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error('Delete product error:', data);
        alert(data.message || 'Error deleting product');
      } else {
        if (editingId === id) resetForm();
        onRefresh();
      }
    } catch (err) {
      console.error('Delete product error:', err);
      alert('Network error while deleting product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <section className="admin-form-section">
        <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-grid">
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Price (₹)
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>
            <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                </select>
              </label>
            <label>
              Image URL(s)
              <input
                name="imageUrls"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrls}
                onChange={handleChange}
              />
              <span className="hint">
                For now use one main image URL (from Cloudinary, Unsplash, etc.).
              </span>
            </label>
          </div>
          <label className="admin-textarea-label">
            Description
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-btn primary"
              disabled={loading}
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button
                type="button"
                className="admin-btn ghost"
                onClick={resetForm}
                disabled={loading}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-products-section">
        <h3>Existing Products</h3>
        <div className="admin-products-grid">
          {products.map((p) => (
            <div key={p._id} className="admin-product-card">
              <div className="admin-product-image-wrapper">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="admin-product-image"
                  />
                ) : (
                  <div className="admin-product-placeholder" />
                )}
                <div className="admin-card-overlay">
                  <button
                    className="admin-card-btn edit"
                    onClick={() => handleEditClick(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-card-btn delete"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="admin-product-body">
                <h4>{p.name}</h4>
                <p className="admin-product-price">₹{p.price}</p>
                <p className="admin-product-category">{p.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
