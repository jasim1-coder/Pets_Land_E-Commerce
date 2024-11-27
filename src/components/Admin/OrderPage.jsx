import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext'; // Adjust the import path based on your project structure
import axios from 'axios';
import "./Order.css"

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/orders'); // Assuming orders are available at this endpoint
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container-fluid">
      <h2>Orders</h2>

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">User Name</th>
              <th scope="col">Product Name</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userName}</td>
                <td>{order.productName}</td>
                <td>${order.amount}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default OrdersPage;
