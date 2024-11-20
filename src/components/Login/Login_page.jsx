import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login_Page.css';
import * as Yup from 'yup';
import { CartContext } from '../../context/CartContext';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Required'),
});

function Login_Page() {
  const navigate = useNavigate();
  const {login,setLogin} = useContext(CartContext)

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      const matchedUser = users.find(
        (user) => user.email === values.email && user.password === values.password
      );

      if (matchedUser) {
        localStorage.setItem('id', matchedUser.id);
        localStorage.setItem('name', matchedUser.name);
        setLogin(true)
        alert('Login successful!');
        navigate('/');
      } else {
        setFieldError('email', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
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
              <label htmlFor="email">E-mail</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            <button type="button" onClick={() => navigate('/register')}>
              Register
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default Login_Page;
