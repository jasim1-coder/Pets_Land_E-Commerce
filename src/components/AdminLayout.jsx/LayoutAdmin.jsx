import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Sidebar from './Sidebar'; // Assuming you have a Sidebar component
import '../Admin/Navbar.css'

function LayoutAdmin() {
  return (
    <>
      <Navbar />
      <div className="container-fluid m-0">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-4 home1">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LayoutAdmin;
