import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from "../../context/CartContext";
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useContext(CartContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchTotalPrice = async () => {
      try {
        const price = await getTotalPrice();
        setTotalPrice(price);
      } catch (error) {
        console.error("Error fetching total price:", error);
      }};
    fetchTotalPrice();
  },[cart, getTotalPrice]); 

  const handlePlaceOrder = () => {
    navigate('/place-order');
  };
  
  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div className="cart-items-container">
          {cart.map((product) => (
            <div key={product.id} className="cart-item">
  <img src={product.image} alt={product.name} className="cart-item-image" />
  <div className="cart-item-details">
    <h3>{product.name}</h3>
    <p>Price: ₹{product.price}</p>
    <p>Quantity: {product.quantity}</p>
    <p>Total: ₹{product.price * product.quantity}</p> {/* Calculate total price */}
    
    <div className="cart-item-actions">
      <button className="action-btn" onClick={() => increaseQuantity(product.id)}>+</button>
      <button className="action-btn" onClick={() => decreaseQuantity(product.id)}>-</button>
      <button className="action-btn" onClick={() => removeFromCart(product.id)}>Remove</button>
    </div>
  </div>
</div>
      ))}
          <div className="total"><p>Total Price: ₹{totalPrice}</p></div>
          <button className="place-order-btn" onClick={handlePlaceOrder}>Buy Now</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
