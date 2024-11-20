import React, { useState, useContext } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Place_Order.css';
import { CartContext } from '../../context/CartContext';

// Form validation schema
const validationSchema = Yup.object({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  street: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string().required('Postal code is required'),
  paymentMethod: Yup.string().oneOf(['creditCard', 'paypal'], 'Please select a payment method').required('Payment method is required'),
});

const initialValues = {
  name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  paymentMethod: 'creditCard',
};

function PlaceOrderPage() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const placeOrder = async (address, paymentMethod) => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      alert("Please log in to place an order.");
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data;

      // Create the order object
      const order = {
        orderId: Date.now(), // Unique order ID based on the timestamp
        timestamp: new Date().toISOString(), // Date and time when the order was placed
        address, // Address from the form
        paymentMethod, // Payment method selected by the user (e.g., creditCard, paypal)
        items: cart.map(item => ({
          id: item.id,
          image: item.image,
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price, // Total price for each item
        })),
        totalPrice: cart.reduce((total, item) => total + item.price * item.quantity, 0), // Total price of the order
      };

      // Add the order to the user's order history
      const updatedOrders = [...user.order, order];

      // Clear the cart after placing the order
      const updatedCart = [];

      // Update the user's orders and cart on the server
      await axios.patch(`http://localhost:3000/users/${userId}`, {
        cart: updatedCart,
        order: updatedOrders,
      });

      // Update the local cart state
      setCart(updatedCart);

      alert("Order placed successfully!");
      navigate("/Order_Success");

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    placeOrder(values.street, values.paymentMethod);
  };

  // Dynamic form fields
  const formFields = [
    { name: 'name', type: 'text', placeholder: 'Full Name' },
    { name: 'email', type: 'email', placeholder: 'Email Address' },
    { name: 'phone', type: 'text', placeholder: 'Phone Number' },
    { name: 'street', type: 'text', placeholder: 'Street Address' },
    { name: 'city', type: 'text', placeholder: 'City' },
    { name: 'state', type: 'text', placeholder: 'State' },
    { name: 'postalCode', type: 'text', placeholder: 'Postal Code' },
  ];

  return (
    <div className="place-order-page">
      <h2>Place Your Order</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="place-order-form">
            <h3>Address Details</h3>
            {formFields.map((field) => (
              <div key={field.name} className="form-field">
                <Field
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  required
                />
                <ErrorMessage name={field.name} component="div" className="error-message" />
              </div>
            ))}

            <h3>Payment Method</h3>
            <div className="payment-methods">
              <label>
                <Field
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={values.paymentMethod === 'creditCard'}
                />
                Credit Card
              </label>
              <label>
                <Field
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={values.paymentMethod === 'paypal'}
                />
                PayPal
              </label>
              <ErrorMessage name="paymentMethod" component="div" className="error-message" />
            </div>

            <button type="submit" className="place-order-submit-btn" disabled={loading}>
              {loading ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PlaceOrderPage;
