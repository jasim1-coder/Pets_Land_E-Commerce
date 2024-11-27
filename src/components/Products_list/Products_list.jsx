import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Products_list.css";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const ProductList = ({ selectedCategory}) => {
  const [products, setProducts] = useState([]);
  const {search} = useContext(CartContext)

  useEffect(() => {
    const fetchProd = async () => {
      try {
        const response = await axios.get("http://localhost:3000/product");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
  
    fetchProd();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchedCategory = selectedCategory ? product.category === selectedCategory : true ;
    const matchedSearch =  search ? product.name.toLowerCase().includes(search.toLowerCase()) : true;
    return matchedCategory && matchedSearch;
  })
  return (
    <div className="product-list">
        {filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (filteredProducts.map((product) => (
        <div key={product.id} className="product-card">
          <Link to={`/products/${product.id}`}>
            <img className="imagess" src={product.image} alt={product.name} />
          </Link>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ₹{product.price}</p>
          <p>Seller: {product.seller}</p>
        </div>
      ))
    )}
    </div>
  );
};

export default ProductList;
