import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./admin.css";

const ManageProducts = () => {
  const { products, deleteProduct, editProduct, addProduct } = useContext(AdminContext);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState({});
  const [modalType, setModalType] = useState(null);
  

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
    toast.success("Product deleted successfully!");
  };
  const handleAddProduct = () => {
      setProductData({
      name: "",
      category: "",
      price: "",
      oldPrice:"",
      stock: "",
      seller: "",
      ingredients: [],
      image: "",
      description: "",
    });
    setModalType("add")

  }

  const handleEditProduct = (product) => {
    console.log("Edit button clicked", product); 
    console.log("isModalOpen:", modalType); // Check if the function is being triggered

    setProductData(product); // Set the product data to be edited
    setIsEditing(true); // Mark as editing
    setModalType("edit"); // Open the modal
  };

  const handleCloseModal = () => {
    setModalType(null)
  }

  const handleSaveProduct = (updatedProduct) => {

    if(modalType === "add"){
      addProduct(productData)
      toast.success("Product added successfully!");

    }else if (modalType === "edit"){
      editProduct(updatedProduct.id, updatedProduct)
      toast.success("Product updated successfully!");
      
    }
    handleCloseModal();
  };

  return (
    <div className="handle-products">
      <h2>Admin Product Management</h2>
      <div className="filter-category">
        <label>Filter by Category:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
      </div>
      <div>
        <button onClick={() => {handleAddProduct(productData)}}>Add Product</button>
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Seller</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.name} className="product-image" />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.seller}</td>
                <td>
                  <button onClick={() => handleEditProduct(product)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalType && (
        <Modal
          modalType = {modalType}
          productData={productData}
          setProductData={setProductData}
          onSave={handleSaveProduct}
          onClose={handleCloseModal}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default ManageProducts;
