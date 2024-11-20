import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";


// Create a context for the cart
export const CartContext = createContext();

function CartContextProvider({ children }) {

  const [cart, setCart] = useState([]);
  const [login,setLogin] = useState(false)

  // useEffect(() => {
  //   const fetchUserCart = async () => {
  //     const userId = localStorage.getItem("id");
  //     if (userId) {
  //       try {
  //         const response = await axios.get(`http://localhost:3000/users/${userId}`);
  //         setCart(response.data.cart || []);
  //       } catch (error) {
  //         console.error("Error fetching cart:", error);
  //       }
  //     }
  //   };
  //   fetchUserCart();
  // }, [login]);
  useEffect(()=>{
    const fetchCart = async () => {
      const userId = localStorage.getItem("id")
      const response = await axios.get(`http://localhost:3000/users/${userId}`)
      setCart(response.data.cart || [])
    }
    fetchCart();
  },[login])

  // Add item to the cart
  const addToCart = async (product) => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      alert("Please log in to add items to your cart.");
      window.location.href = "/login";
      return;
    }

    try {
      // Fetch the user's current data from the server
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;

      // Check if the product is already in the cart
      const existingProductIndex = user.cart.findIndex((item) => item.id === product.id);

      if (existingProductIndex >= 0) {
        // If the product is already in the cart, alert the user
        alert("This product is already in your cart.");
        return;
      }

      // If the product doesn't exist, add it to the cart with quantity = 1
      user.cart.push({ ...product, quantity: 1 });

      // Update the user's cart on the server
      await axios.patch(`http://localhost:3000/users/${userId}`, { cart: user.cart });

      // Update the local cart state
      setCart(user.cart);

      // alert("Product added to cart successfully!");
      toast.success("added to cart")
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  // Remove item from the cart
  const removeFromCart = async (productId) => {
    const userId = localStorage.getItem("id");

    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;

      const updatedCart = user.cart.filter((item) => item.id !== productId);

      await axios.patch(`http://localhost:3000/users/${userId}`, { cart: updatedCart });
      setCart(updatedCart);

      alert("Product removed from cart!");
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Increase quantity of a product in the cart
  const increaseQuantity = async (productId) => {
    const userId = localStorage.getItem("id");

    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;

      const productIndex = user.cart.findIndex((item) => item.id === productId);

      if (productIndex >= 0) {
        user.cart[productIndex].quantity += 1;
        await axios.patch(`http://localhost:3000/users/${userId}`, { cart: user.cart });
        setCart([...user.cart]);
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  // Decrease quantity of a product in the cart
  const decreaseQuantity = async (productId) => {
    const userId = localStorage.getItem("id");

    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;

      const productIndex = user.cart.findIndex((item) => item.id === productId);

      if (productIndex >= 0 && user.cart[productIndex].quantity > 1) {
        user.cart[productIndex].quantity -= 1;
        await axios.patch(`http://localhost:3000/users/${userId}`, { cart: user.cart });
        setCart([...user.cart]);
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  // Get total price of items in the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalPrice,
        login,
        setLogin
        
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContextProvider;
