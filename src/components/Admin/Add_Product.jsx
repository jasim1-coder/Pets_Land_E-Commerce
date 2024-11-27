// ManageProducts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Admin.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/product');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/product/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="admin-products">
      <h2>Manage Products</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>₹{product.price}</p>
            <div className="admin-buttons">
              <Link to={`/admin/products/edit/${product.id}`} className="admin-button">
                Edit
              </Link>
              <button onClick={() => handleDelete(product.id)} className="admin-button delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Link to="/admin/products/add" className="admin-button add-new">
        Add New Product
      </Link>
    </div>
  );
};

export default ManageProducts;
