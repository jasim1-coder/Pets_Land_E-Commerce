import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GlobalOrder.css'; // Import your custom CSS

const GlobalOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all orders globally when the component mounts
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/Orders'); // API endpoint to fetch orders
        setOrders(response.data); // Store orders in state
        setLoading(false); // Stop loading
      } catch (error) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false); // Stop loading on error
      }
    };

    fetchOrders();
  }, []);

  // If loading, show a loading message
  if (loading) {
    return <div className="text-center">Loading orders...</div>;
  }

  // If there is an error, show the error message
  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      {/* Container for cards */}
      <div className="card-container">
        {[...orders].reverse().map((order) => (
          <div key={order.orderId} className="card card-order">
            <div className="card-header">
              <h4>Order ID: {order.orderId}</h4>
            </div>
            <div className="card-body">
              <div className="order-details">
                <p><strong>User Name:</strong> {order.usrName}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Order Date:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
                <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
              </div>

              <div className="order-items">
                <h5>Items:</h5>
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-details">
                      <p>{item.name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                      <p>Total: ${item.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer order-footer">
              <button className="btn btn-secondary btn-sm btn-close">Close</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalOrders;
