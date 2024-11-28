import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageUser.css'; // Import custom styles
import Modal from "./Modal1";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [cartModalContent, setCartModalContent] = useState([]);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalContent, setOrderModalContent] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenCartModal = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${id}`);
      const user = response.data;
      setCartModalContent(user.cart || []); // Set cart content
      setCartModalOpen(true);
    } catch (error) {
      console.error('Error fetching user cart:', error);
    }
  };

  const handleOpenOrderModal = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${id}`);
      const user = response.data;
      setOrderModalContent(user.order || []); // Set order content
      
      setOrderModalOpen(true);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const handleCloseCartModal = () => {
    setCartModalOpen(false);
    setCartModalContent([]);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setOrderModalContent([]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      await axios.patch(`http://localhost:3000/users/${userId}`, { blocked: !isBlocked });
      setUsers(users.map((user) => (user.id === userId ? { ...user, blocked: !isBlocked } : user)));
    } catch (error) {
      console.error('Error updating user block status:', error);
    }
  };

  return (
    <div className="">
      <h2 className="">Manage Users</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Order History</th>
              <th>Cart Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.blocked ? 'bg-danger' : 'bg-success'}`}>
                    {user.blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td>
                  {user.order && user.order.length > 0 ? (
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleOpenOrderModal(user.id)}
                    >
                      View Orders
                    </button>
                  ) : (
                    <span>No Orders</span>
                  )}
                </td>
                <td>
                  {user.cart && user.cart.length > 0 ? (
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleOpenCartModal(user.id)}
                    >
                      View Cart
                    </button>
                  ) : (
                    <span>Empty Cart</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleToggleBlock(user.id, user.blocked)}
                    className={`btn ${user.blocked ? 'btn-success' : 'btn-danger'} btn-sm`}
                  >
                    {user.blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn btn-danger btn-sm ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCartModalOpen} onClose={handleCloseCartModal}>
  <h2 className="text-center text-primary">User Cart</h2>
  {cartModalContent.length > 0 ? (
    <div className="container py-3">
      {cartModalContent.map((item) => (
        <div key={item.id} className="border p-4 mb-4 rounded shadow-sm">
          <div className="d-flex align-items-center">
            <img
              src={item.image}
              alt={item.title}
              className="img-fluid rounded me-3"
              style={{ maxWidth: '80px' }}
            />
            <div>
              <h5 className="mb-1">{item.name}</h5>
              <p className="mb-1">
                <span className="text-muted">Quantity:</span> {item.quantity}
              </p>
              <p className="mb-1">
                <span className="text-muted">Price:</span> ₹{item.price}
              </p>
              <p className="mb-1">
                <span className="text-muted">Total Price:</span> ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-danger">No items in the cart.</p>
  )}
  <button onClick={handleCloseCartModal} className="btn btn-outline-danger d-block mx-auto mt-3">
    Close
  </button>
</Modal>

      {/* Order Modal */}
      <Modal isOpen={isOrderModalOpen} onClose={handleCloseOrderModal}>
  <h2 className="text-center text-primary">User Orders</h2>
  {orderModalContent.length > 0 ? (
    <div className="container py-3">
      {orderModalContent.map((order) => (
        <div key={order.orderId} className="border p-4 mb-4 rounded shadow-sm">
          <h3 className="fs-4">Order ID: {order.orderId}</h3>
          <p><strong className="fw-bold">Name:</strong> {order.usrName}</p>
          <p><strong className="fw-bold">Address:</strong> {order.address}</p>
          <p><strong className="fw-bold">Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong className="fw-bold">Order Date:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
          <p><strong className="fw-bold">Total Price:</strong> ₹ {order.totalPrice}</p>
          
          <h4 className="fs-5">Items:</h4>
          <div className="list-group">
            {order.items.map((item) => (
              <div key={item.id} className="list-group-item d-flex align-items-center mb-2">
                <img src={item.image} alt={item.name} className="img-fluid rounded me-3" style={{ maxWidth: '80px' }} />
                <div>
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="mb-1"><span className="text-muted">Quantity:</span> {item.quantity}</p>
                  <p className="mb-1"><span className="text-muted">Price:</span> ₹{item.price}</p>
                  <p><span className="text-muted">Total:</span> ₹{item.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-danger">No orders found.</p>
  )}
  <button onClick={handleCloseOrderModal} className="btn btn-outline-danger d-block mx-auto mt-3">
    Close
  </button>
</Modal>

    </div>
  );
};

export default ManageUsers;
    