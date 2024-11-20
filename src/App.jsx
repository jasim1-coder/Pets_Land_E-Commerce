import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login_Page from "./components/Login/Login_page";
import Register_Page from "./components/Login/Register_page";
// import Front_page from "./components/Front_page";
import Layout from "./Layout/Layout";
// import ProductList from "./components/Products_list/Products_list";
import Home from "./components/Home/Home";
import ProductDetail from "./components/Product_detail/Products_details";
import CartContext from "./context/CartContext";
import CartPage from "./components/Cart/CartPage";
import PlaceOrderPage from "./components/Order/Place_Order";
import OrderSuccessPage from "./components/Success_Page/Order_Success";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <CartContext>
      <Toaster/>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* <Route path="/Front-page" element={<Front_page />} /> */}
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/place-order" element={<PlaceOrderPage />} />
          <Route path="/Order_Success" element={<OrderSuccessPage/>}/>
        </Route>
        <Route path="/Login" element={<Login_Page />} />
        <Route path="/register" element={<Register_Page />} />
        
      </Routes>
    </Router>
    </CartContext>
  );
}

export default App;
