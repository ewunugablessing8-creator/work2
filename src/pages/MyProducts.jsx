import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Product.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/api/products/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [navigate]);

  const handleDelete = async (productId, productName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(productId);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== productId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">Account Hub</div>

        <nav>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>

          
          <Link to="/products" className="nav-link active">
            Products
          </Link>


          <Link to="/my-products" className="nav-link active">
            My Products
          </Link>

          <Link to="/settings" className="nav-link">
            Settings
          </Link>

          <button onClick={logout} className="btn-outline">
            Logout
          </button>
        </nav>
      </header>

      <main className="container">
        <div className="products-header">
          <div>
            <h1 className="products-title">My Products</h1>
            <p className="products-subtitle">
              Manage the products you have created.
            </p>
          </div>

          <Link to="/products/create" className="btn-primary">
            + Add Product
          </Link>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="products-grid">
          {products.length === 0 ? (
            <div className="empty-state">
              <h2>No products yet</h2>
              <p>Add your first product to begin managing your inventory.</p>

              <Link to="/products/create" className="btn-primary">
                Add Product
              </Link>
            </div>
          ) : (
            products.map((product) => (
              <article key={product._id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="product-image"
                  />
                </div>

                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h2 className="product-name">{product.name}</h2>

                  <p className="product-description">
                    {product.description || "No description available."}
                  </p>

                  <p className="product-price">
                    ${Number(product.price || 0).toFixed(2)}
                  </p>

                  <p
                    className={`product-stock ${
                      product.stock > 0 ? "in-stock" : "out-of-stock"
                    }`}
                  >
                    {product.stock > 0
                      ? `In Stock: ${product.stock}`
                      : "Out of Stock"}
                  </p>

                  <div className="product-actions">
                    <Link
                      to={`/product/edit/${product._id}`}
                      className="btn-secondary"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn-danger"
                      onClick={() =>
                        handleDelete(product._id, product.name)
                      }
                      disabled={deletingId === product._id}
                    >
                      {deletingId === product._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default MyProducts;