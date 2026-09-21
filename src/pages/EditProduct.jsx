import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CreateProduct.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("You are not logged in. Please log in again.");
        }

        const { data } = await axios.get(`${API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const product = data.product || data;

        setProductName(product.name || "");
        setCategory(product.category || "");
        setPrice(product.price ?? "");
        setStock(product.stock ?? "");
        setDescription(product.description || "");
        setImage(product.image || "");
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in. Please log in again.");
      }

      await axios.put(
        `${API_URL}/api/products/${id}`,
        {
          name: productName,
          category,
          price: Number(price),
          stock: Number(stock),
          description,
          image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;

  return (
    <div className="create-product-page">
      <div className="form-header">
        <h2>Edit Product</h2>

        <button
          type="button"
          className="back-link"
          onClick={() => navigate("/products")}
        >
          ← Back to Products
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Product Name *
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </label>

        <label>
          Category *
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </label>

        <label>
          Price ($) *
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Stock *
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </label>

        <label>
          Description *
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Image URL
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;

