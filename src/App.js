import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Cart from './Cart';
import CarDetails from './CarDetails';
import Support from './Support';
import Checkout from './Checkout';
import LoginPage from './LoginPage';
import AboutUs from './AboutUs';

const App = () => {
  const [cart, setCart] = useState([]);

  const addToCart = async (item) => {
    try {
      const userId = 1;
      await axios.post('http://localhost:5000/api/cart', {
        userId,
        carId: item.id,
        startDate: '',
        endDate: ''
      });
      setCart((prevCart) => [...prevCart, item]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (item) => {
    try {
      const userId = 1;
      await axios.delete(`http://localhost:5000/api/cart/${userId}/${item.id}`);
      setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== item.id));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
        <Route path="/car-details" element={<CarDetails />} />
        <Route path="/support" element={<Support />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
};

export default App;
