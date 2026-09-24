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
  return sum + item.price * item.qty
}, 0)};


export default Cart;