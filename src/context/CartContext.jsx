import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

//context
export const CartContext = createContext();

function CartContextProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [login, setLogin] = useState(false);
  const [search, setSearch] = useState("")

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const fetchCart = async () => {
      if (!userId) return;
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      setCart(response.data.cart || []);
    };
    fetchCart();
  }, [login]);

  // Add item to the cart
  const addToCart = async (product) => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    const response = await axios.get(`http://localhost:3000/users/${userId}`);
    const user = response.data;
    const existProdInd = user.cart.findIndex((item) => item.id === product.id);

    if (existProdInd >= 0) {
      return toast("This product is already in your cart.");
    }
    user.cart.push({ ...product, quantity: 1 });
    await axios.patch(`http://localhost:3000/users/${userId}`, {
      cart: user.cart,
    });
    setCart(user.cart);
    toast.success("added to cart");
  };

  // Remove item
  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem("id");
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;

      const updatedCart = user.cart.filter((item) => item.id !== productId);

      await axios.patch(`http://localhost:3000/users/${userId}`, {
        cart: updatedCart,
      });
      setCart(updatedCart);

      toast.success("Product removed from cart!");
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Increase quantity
  const increaseQuantity = async (productId) => {
    const userId = localStorage.getItem("id");
  
    if (!userId) return;
  
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;
      const productIndex = user.cart.findIndex((item) => item.id === productId);
  
      if (productIndex >= 0) {
        const cartItem = user.cart[productIndex];
  
        const productResponse = await axios.get(`http://localhost:3000/product/${productId}`);
        const product = productResponse.data;
  
        if (cartItem.quantity + 1 > product.stock) {
          toast.error(`Insufficient stock`);
          return;
        }
  
        cartItem.quantity += 1;
  
        await axios.patch(`http://localhost:3000/users/${userId}`, {
          cart: user.cart,
        });
  
        setCart([...user.cart]);
        toast.success(`Quantity updated.`);
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
      toast.error("Error updating the quantity. Please try again.");
    }
  };
  

  // Decrease quantity
  const decreaseQuantity = async (productId) => {
    const userId = localStorage.getItem("id");

    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;

      const productIndex = user.cart.findIndex((item) => item.id === productId);

      if (productIndex >= 0 && user.cart[productIndex].quantity > 1) {
        user.cart[productIndex].quantity -= 1;
        await axios.patch(`http://localhost:3000/users/${userId}`, {
          cart: user.cart,
        });
        setCart([...user.cart]);
        toast.success(`Quantity updated.`);

      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  //  total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
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
        setLogin,
        search,setSearch
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContextProvider;
