import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
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

  const [selectedCategory, setSelectedCategory] = useState("all");


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get('http://localhost:3000/product');
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, [products]); 
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:3000/users');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, [users]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await axios.get('http://localhost:3000/Orders');
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    fetchOrders();
  }, [orders]);


  const updateCategory = (category) => {
    setSelectedCategory(category);
  };


  useEffect(() => {
    setTotalUsers(users.length);
    setTotalProducts(products.length);
    setTotalOrders(orders.length);

    const revenue = orders.reduce((total, order) => total + (order.totalPrice || 0), 0);
    setTotalRevenue(revenue);

    // Get recent 5 orders 
    const sortedOrder = orders.slice(-5);
    setRecentOrders(sortedOrder);
  }, [users, products, orders]);

  // Add product
  const addProduct = async (productData) => {
    try {
      const response = await axios.post('http://localhost:3000/product', productData);
      setProducts((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Edit  product
  const editProduct = async (id, updatedProduct) => {
    try {
      const response = await axios.put(`http://localhost:3000/product/${id}`, updatedProduct);
      setProducts((prev) => prev.map((product) => (product.id === id ? response.data : product))
      );
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  // Delete  product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/product/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Block or unblock a user
  const blockUser = async (userId, isBlocked) => {
    try {
      const updatedStatus = { blocked: !isBlocked };
      await axios.patch(`http://localhost:3000/users/${userId}`, updatedStatus);
      setUsers((prevUsers) => prevUsers.map((user) => user.id === userId ? { ...user, blocked: !isBlocked } : user ));
      toast.success(isBlocked ?'User unblocked successfully' :  'User blocked successfully');
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
        setUsers,
        orders,
        selectedCategory,
        updateCategory,
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        topSellingProducts,
        recentOrders,
        addProduct,
        editProduct,
        deleteProduct,
        deleteUser,
        blockUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider
// Custom hook to use AdminContext
// export const useAdminContext = () => {
//   return useContext(AdminContext);
// };
