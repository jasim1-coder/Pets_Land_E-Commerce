import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Product_detail.css';
import { CartContext } from '../../context/CartContext';

const ProductDetail = () => {
  const { addToCart } = useContext(CartContext); // Access addToCart function from context
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch product details from backend
    axios
      .get(`http://localhost:3000/product/${id}`) // Replace with your actual backend URL
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <img src={product.image} alt={product.title} />
        <div className="product-info">
          <h2>{product.title}</h2>
          <p className="description">{product.description}</p>
          <p className="price">Price: ₹{product.price}</p>
          {product.discount && (
            <p className="discount">Discount: {product.discount}%</p>
          )}
          <p className="brand">Brand: {product.brand}</p>
          <button 
            className="add-to-cart-button" 
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
