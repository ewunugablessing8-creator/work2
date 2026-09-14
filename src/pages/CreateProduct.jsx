import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProduct.css";

const CreateProduct = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [productName, setProductName] = useState();
  const [category, setCategory] = useState();
  const [price, setPrice] = useState();
  const [stock, setStock] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          category: category,
          price: price,
          stock: stock,
          description: description,
          image: image,
        }),
      });

      if (res.ok) {
        navigate("/products");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-page">
      <div className="form-header">
        <h2>Create Product</h2>
        <button
          type="button"
          className="back-link"
          onClick={() => (window.location.href = "/products")}
        >
          ← Back to Products
        </button>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Product Name *
          <input
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </label>

        <label>
          Category *
          <input
            type="text"
            placeholder="e.g. Electronics, Clothing..."
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
            placeholder="0.00"
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
            placeholder="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </label>

        <label>
          Description *
          <textarea
            placeholder="Enter a detailed description of the product..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Image URL
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
