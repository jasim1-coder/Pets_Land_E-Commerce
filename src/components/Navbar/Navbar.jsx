import React, { useContext, useEffect } from 'react';
import { IoCart } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from "../../images/logo.jpg";
import { CartContext } from '../../context/CartContext';

function Navbar() {
  const { cart,login, setLogin } = useContext(CartContext);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    setLogin(!!userId); // Simplified boolean conversion
  }, [setLogin]);

  const handleLogout = () => {
    localStorage.clear(); // Removes all local storage items
    setLogin(false);
    alert("Logged out successfully!");
    window.location.href = '/login';
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
          <input type="search" placeholder="Search for pet products..." />
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
        {/* Only show the badge if cart has items */}
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
