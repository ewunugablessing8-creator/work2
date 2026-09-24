import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Product.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState('');
  const [addingId, setAddingId] = useState('');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Could not load products (${res.status})`);
        }

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

   
    fetchProducts();
  }, []);

   const handleAddToCart = async (productId) => {
      setAddingId(productId);
      setError('');

      try {
        await axios.post(`${API_URL}/api/cart/items`,
          { productId, qty: 1 },
          {
            headers:{
              Authorization: `Bearer ${localStorage.getItem('token')}`,

            },
          }
        );
      }  catch (err) {
        setError(err.message || "Failed to add cart");
      } finally {
        setAddingId(null);
      }
    };


  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

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
          <Link to="/settings" className="nav-link">
            Settings
          </Link>
          <Link to="/my-products" className="nav-link">
            My Products
          </Link>
          <Link to="/products/create" className="btn-primary">
            + Add Product
          </Link>
          <button onClick={logout} className="btn-outline">
            Logout
          </button>
        </nav>
      </header>

      <main className="container">
        <div className="products-header">
          <h1 className="products-title">Products</h1>

          <Link to="/products/create" className="btn-primary">
            + Add Product
          </Link>
        </div>

        <div className="products-grid">
          {products.length === 0 ? (
            <div className="empty-state">
              <p>No products found. Add your first product!</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="product-image"
                  />
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-price">${product.price}</p>

                  <p
                    className={`product-stock ${
                      product.stock > 0 ? "in-stock" : "out-of-stock"
                    }`}
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock})`
                      : "Out of Stock"}
                  </p>

                  <Link
                    to={`/product/edit/${product._id}`}
                    className="btn-secondary"
                  >
                    Edit
                  </Link>
                  <button className="btn-add"
                  disabled={product.stock < 1 || addingId === product._id}
                   onClick={() => handleAddToCart(product._id)}>
                    {product.stock < 1
                    ? 'Out of stock'
                    : addingId === product._id
                    ? 'Adding...'
                    : 'Add to Cart'}
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Products;
