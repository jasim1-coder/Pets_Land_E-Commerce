import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register_Page.css';
import * as Yup from 'yup';

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

function Register_Page() {
  const navigate = useNavigate();

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      // Fetch all users from the database
      const response = await axios.get('http://localhost:3000/users');
      const existingUsers = response.data;
  
      // Check if the email already exists
      const userExists = existingUsers.some(user => user.email === values.email);
  
      if (userExists) {
        alert('Email already exists. Please use a different email.');
      } else {
        // If email is unique, register the new user
        const data = {
          ...values,
          cart: [],
          order: [],
        };
  
        await axios.post('http://localhost:3000/users', data);
        alert('Registration successful!');
        navigate('/login'); // Redirect to the login page
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Server error. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <div className="Overall">
          <Form className="form-container">

            <div className="form-control">
              <label htmlFor="name">Name</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>
            <div className="form-control">
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <div className="form-control">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field type="password" id="confirmPassword" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
            <button type="button" onClick={() => navigate('/login')}>
              Back to Login
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default Register_Page;