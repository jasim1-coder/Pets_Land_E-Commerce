import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Order_Sucess.css';

function OrderSuccessPage() {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const userId = localStorage.getItem("id"); // Retrieve the user ID from localStorage
        if (userId) {
          const response = await fetch(`http://localhost:3000/users/${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch order details");
          }
          const data = await response.json();

          setOrderDetails(data.order); // Store the orders array in state
        } else {
          throw new Error('No user ID found.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="order-success-page">
      <div className="order-summary">
        {orderDetails.length === 0 ? (
          <p>No items ordered.</p>
        ) : (
          <>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            {orderDetails.map((order, orderIndex) => (
              <div key={orderIndex} className="order-details">
                <h3>Order Summary</h3>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Date:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
                <p><strong>Total:</strong>  ₹{order.totalPrice.toFixed(2)}</p>

                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} className="order-item">
                      <img 
                        src={item.image || 'default-image.jpg'} 
                        alt={item.name} 
                        className="item-image" 
                      />
                      <div className="item-details">
                        <p><strong>{item.name}</strong></p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price.toFixed(2)}</p>
                        <p>Total: ₹{item.total.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>

      <Link to="/" className="continue-shopping-button">
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderSuccessPage;
