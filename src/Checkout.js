import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || { cartItems: [] };
  const [errors, setErrors] = useState([]);

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const startDate = new Date(item.start_date);
      const endDate = new Date(item.end_date);
      const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return total + (diffDays * parseFloat(item.conditie));
    }, 0);
  };

  const handlePlaceOrder = async () => {
    const userId = 1;
    try {
      const response = await axios.post('http://localhost:5000/api/checkout', {
        userId,
        cartItems
      });
      alert('Order placed successfully');
      navigate('/home');
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Failed to place order');
      }
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      <ul>
        {cartItems.map((car) => (
          <li key={car.id}>
            <h2>{car.brand} {car.model}</h2>
            <p>Data început: {car.start_date}</p>
            <p>Data sfârșit: {car.end_date}</p>
            <p>Preț per zi: {car.conditie} €</p>
          </li>
        ))}
      </ul>
      <h3>Preț total: {calculateTotalPrice()} €</h3>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default Checkout;
