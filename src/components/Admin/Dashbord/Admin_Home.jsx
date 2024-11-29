import React, { useContext } from "react";
import { AdminContext } from "../../../context/AdminContext"; // Adjust the import path based on your project structure
import "../Navbar.css";
import PieChart from "../PieChart/PieChart";

const AdminDashboard = () => {
  const {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    topSellingProducts,
    recentOrders,
  } = useContext(AdminContext);

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Main Content */}
        <main className="col-md-12 px-4">
          <h2>Dashboard</h2>

          {/* Dashboard Stats */}
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <p className="card-text">{totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card text-white bg-success mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Products</h5>
                  <p className="card-text">{totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card text-white bg-warning mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Orders</h5>
                  <p className="card-text">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card text-white bg-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Revenue</h5>
                  <p className="card-text">₹{totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          {/* <h3>Top Selling Products</h3>
          {topSellingProducts && topSellingProducts.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Sales Quantity</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map((product, index) => (
                  <tr key={product.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products available.</p>
          )} */}

          {/* Recent Orders */}
          <h3>Recent Orders</h3>
          {recentOrders && recentOrders.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Order ID</th>
                  <th scope="col">User Name</th>
                  <th scope="col">Payment Method</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[...recentOrders].reverse().map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.usrName}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{order.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No recent orders available.</p>
          )}
        </main>
        <PieChart/>

      </div>
    </div>
  );
};

export default AdminDashboard;
