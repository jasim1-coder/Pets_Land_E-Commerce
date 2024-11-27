import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create the AdminContext
export const AdminContext = createContext();

// AdminContextProvider Component
export const AdminContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Derived states for stats
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Fetch products, users, and orders data from the server
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get('http://localhost:3000/product');
        setProducts(productsResponse.data);

        // Fetch users
        const usersResponse = await axios.get('http://localhost:3000/users');
        setUsers(usersResponse.data);

        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:3000/Orders');
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [products,users,orders]);

  useEffect(() => {
    // Update derived stats whenever products, users, or orders change
    setTotalUsers(users.length);
    setTotalProducts(products.length);
    setTotalOrders(orders.length);

    // Calculate total revenue
    const revenue = orders.reduce((total, order) => total + (order.totalPrice || 0), 0);
    setTotalRevenue(revenue);

    // Find top-selling products based on quantity ordered
    const productSales = products.map(product => ({
      ...product,
      quantitySold: orders.reduce(
        (quantity, order) => quantity + (order.items.find(p => p.id === product.id)?.quantity || 0),
        0
      )
    }));
    
    const sortedTopSelling = productSales.sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 5);  // Top 5 selling products
    setTopSellingProducts(sortedTopSelling);

    // Get recent orders (latest 5 orders)
    const sortedOrder = orders.slice(-5);
    setRecentOrders(sortedOrder);
  }, [users, products, orders]);

  // Add a new product
  const addProduct = async (productData) => {
    try {
      const response = await axios.post('http://localhost:3000/product', productData);
      setProducts((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Edit an existing product
  const editProduct = async (id, updatedProduct) => {
    try {
      const response = await axios.put(`http://localhost:3000/product/${id}`, updatedProduct);
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? response.data : product))
      );
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/product/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Add a new user
  const addUser = async (newUser) => {
    try {
      const response = await axios.post('http://localhost:3000/users', newUser);
      setUsers((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Edit an existing user (Including Block/Unblock User functionality)
  const editUser = async (id, updatedUser) => {
    try {
      const response = await axios.put(`http://localhost:3000/users/${id}`, updatedUser);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? response.data : user))
      );
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error editing user:', error);
      toast.error('Error updating user');
    }
  };

  // Block or unblock a user
  const blockUser = async (id, isBlocked) => {
    try {
      const updatedUser = { blocked: isBlocked };
      const response = await axios.put(`http://localhost:3000/users/${id}`, updatedUser);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, blocked: isBlocked } : user))
      );
      toast.success(isBlocked ? 'User blocked successfully' : 'User unblocked successfully');
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      toast.error('Error blocking/unblocking user');
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        users,
        orders,
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        topSellingProducts,
        recentOrders,
        addProduct,
        editProduct,
        deleteProduct,
        addUser,
        editUser,
        deleteUser,
        blockUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use AdminContext
export const useAdminContext = () => {
  return useContext(AdminContext);
};
