import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = 1; 
        const result = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCartItems(result.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (carId) => {
    try {
      const userId = 1; 
      await axios.delete(`http://localhost:5000/api/cart/${userId}/${carId}`);
      setCartItems((prevCart) => prevCart.filter((car) => car.id !== carId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleDateChange = (carId, startDate, endDate) => {
    setCartItems((prevCart) => 
      prevCart.map((car) => 
        car.id === carId ? { ...car, start_date: startDate, end_date: endDate } : car
      )
    );
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems } });
  };

  return (
    <div className="cart-container">
      <h1>Coșul Meu</h1>
      <ul>
        {cartItems.length === 0 ? (
          <li>Coșul este gol.</li>
        ) : (
          cartItems.map((car) => (
            <li key={car.id}>
              <h2>{car.brand} {car.model}</h2>
              <p>{car.year}</p>
              <div className="date-picker">
                <div>
                  <label>Data început:</label>
                  <input
                    type="date"
                    value={car.start_date || ''}
                    onChange={(e) => handleDateChange(car.id, e.target.value, car.end_date)}
                  />
                </div>
                <div>
                  <label>Data sfârșit:</label>
                  <input
                    type="date"
                    value={car.end_date || ''}
                    onChange={(e) => handleDateChange(car.id, car.start_date, e.target.value)}
                  />
                </div>
              </div>
              <button onClick={() => handleRemoveFromCart(car.id)}>Șterge</button>
            </li>
          ))
        )}
      </ul>
      {cartItems.length > 0 && (
        <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
      )}
    </div>
  );
};

export default Cart;
