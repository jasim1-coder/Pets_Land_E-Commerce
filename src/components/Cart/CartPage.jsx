import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from "../../context/CartContext";
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useContext(CartContext);
  const [totalPrice, setTotalPrice] = useState(0); // Local state for total price
  const [loading, setLoading] = useState(true); // State for loading indicator
  const navigate = useNavigate(); // useNavigate for navigation

  // Fetch the total price when the component mounts or when cart changes
  useEffect(() => {
    const fetchTotalPrice = async () => {
      try {
        const price = await getTotalPrice();
        setTotalPrice(price);
      } catch (error) {
        console.error("Error fetching total price:", error);
      } finally {
        setLoading(false); // Set loading to false once the total price is fetched
      }
    };

    fetchTotalPrice();
  }, [cart, getTotalPrice]); // Re-run when cart changes

  const handlePlaceOrder = () => {
    // Navigate to the place order page
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
              <img src={product.image} alt={product.title} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{product.title}</h3>
                <p>Price: ₹{product.price}</p>
                <p>Quantity: {product.quantity}</p>

                <div className="cart-item-actions">
                  <button className="action-btn" onClick={() => increaseQuantity(product.id)}>+</button>
                  <button className="action-btn" onClick={() => decreaseQuantity(product.id)}>-</button>
                  <button className="action-btn" onClick={() => removeFromCart(product.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          <div className="total">
            {loading ? (
              <p>Loading total price...</p>
            ) : (
              <p>Total Price: ₹{totalPrice}</p>
            )}
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
