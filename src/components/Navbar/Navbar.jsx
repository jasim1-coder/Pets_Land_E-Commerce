import React, { useContext, useEffect } from 'react';
import { IoCart } from 'react-icons/io5';
import { Link,useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from "../../images/logo.jpg";
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';

function Navbar() {
  const { cart,login, setLogin,setCart,search,setSearch} = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if(userId){
      setLogin(true);}
  }, [setLogin]);

  const handleLogout = () => {
    localStorage.clear(); 
    setLogin(false); 
    setCart([])
    toast.success("Logged out successfully!"); 
    navigate('/login'); 
  };

  const userName = localStorage.getItem("name");

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Pet Shop Logo" className="logo" />
        <Link to="/" className="navbar-brand">Pet's Land</Link>
      </div>
      <div className="navbar-center">
        <form className="search-form">
          <input type="search" placeholder="Search for pet products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>
      <div className="navbar-right">
        {login ? (
          <>
            <span className="user-name">Hi, {userName}</span>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        )}
        <Link to="/Order_Success" className="order-link">Orders</Link>
        <Link to="/cart" className="nav-icon">
        {cart.length > 0 && (
          <div className="cart-length">
            <span>{cart.length}</span>
          </div>
        )}
        <IoCart />
      </Link>
      </div>
    </nav>
  );
}

export default Navbar;
