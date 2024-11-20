import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Products_list.css"
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the backend (API)
    axios
      .get("http://localhost:3000/product") // Replace with your backend URL if needed
      .then((response) => {
        setProducts(response.data); // Save products to state
        setLoading(false); // Stop loading spinner
      })
      .catch((error) => {
        console.error("Error fetching products", error);
        setLoading(false); // Stop loading spinner in case of an error
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <Link to={`/products/${product.id}`}>
            <img className="imagess" src={product.image} alt={product.title} />
          </Link>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p>Price: ₹{product.price}</p>
          <p>Discount: {product.discount}%</p>
          <p>Brand: {product.brand}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
