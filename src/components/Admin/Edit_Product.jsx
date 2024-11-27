import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { useContext } from "react";
import "./Admin.css";

const EditProduct = ({ closeModal }) => {
  const { id } = useParams();
  const { products, editProduct } = useContext(AdminContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = () => {
      const productToEdit = products.find((prod) => prod.id === parseInt(id));
      setProduct(productToEdit);
    };

    fetchProduct();
  }, [id, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product) {
      await editProduct(id, product); // Using the context function
      closeModal(); // Close modal after saving
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={closeModal} className="close-button">
          X
        </button>
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="admin-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
