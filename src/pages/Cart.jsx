import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://localhost:5000'
function Cart(){
const [cart, setCart] = useState({item: []})
const [error, setError] = useState('')
const [loading, setLoading] = useStae(true)
const token = localStorage.getItem('token')
const  fetchCart = async () => {
  try{
    const { data } = await axios.get(`${API_URL}/api/cart`, {
      headers:{
      Authorization: `Bearer ${token}`
      },
    });
    setCart(data)
  }
  catch(error){
    setError(error.response?.data?.message || 'Failed to load cart')
  }
  finally{
    setLoading(false)
  }
}
useEffect(()=>{
  fetchCart()
}, [])

const handleQty = async (productId, qty, stock) => {
  if (qty < 1)return;
  if (qty > stock){
    setError(`Only ${stock} in stock`);
    return;
  }
  setError('');
  try{
    const {data} = await axios.put(`${API_URL}/api/cart/items/${productId}`,
      {qty},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    setCart(data)
  }catch(error){
    setError(error.response?.data?.message || 'Failed to add stock')
  }
  finally{
    setLoading(false)
  }

}
const handleRemove = async (productId)=> {
  setError('')
  try{
    const {data} = await axios.delete(`${API_URL}/api/cart/items/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    setCart(data);
  } catch(error){
    setError(error.response?.data?.message || 'Failed to remove item')
  } finally{
    setLoading(false)
  }
}
const handleClear = async ()=>{
  if(!window.confirm('empty your cart?')) return;
  setError('');
  try{
    const {data} = await axios.delete(`${API_URL}/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    setCart(data)
    
  }
  catch(error){
    setError(error.response?.data?.message || 'Failed to clear cart')
  }
   
};

if(loading) return<div>Loading cart</div>

const items = cart.items || [];
const subtotal = items.reduce((sum, item )=>{
  const price = item.product?.price || 0;
  return sum + price * item.qty;
}, 0);

const handleCheckout = () => {
    if (items.length === 0) return;
}

return(
    <div className='cart-face'>
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

        <main className='container'>
             <div className="cart-header">
                      <h1 className="cart-title">Cart</h1>
            
                      <button onClick={handleClear}>Clear</button>
             </div>
           
            <div className='cart-grid'>
                 items.map((item) = (
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

                              <div className='cart-button'>
                                <button onClick={handleRemove} className='btn-cart'>
                                    remove
                                </button>
                              </div>
                            </div>
                        </div>
                ));
            </div>

        </main>

    </div>

);
};


export default Cart;