import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./GlobalOrder.css"

const GlobalOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/Orders'); 
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false); 
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center my-5">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center text-danger my-5">{error}</div>;
  }

  return (
      <div className="row">
        <div><h2>All Orders</h2></div>
        {[...orders].reverse().map((order) => (
          <div key={order.orderId} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Order ID: {order.orderId}</h5>
              </div>
              <div className="card-body">
                <p><strong>Name:</strong> {order.usrName}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Order Date:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
                <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>

                <h6>Items:</h6>
                <div className="scrollable-list">
                <ul className="list-group grp">

                  {order.items.map((item) => (
                    <li key={item.id} className="list-group-item d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded me-3"
                        style={{ width: '50px' }}
                      />
                      <div>
                        <p className="mb-0">{item.name}</p>
                        <small>Quantity: {item.quantity}</small><br />
                        <small>Price: ₹{item.price}</small><br />
                        <small>Total: ₹{item.total}</small>
                      </div>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
              <div className="card-footer text-center">
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

export default GlobalOrders;
