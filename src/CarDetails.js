import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CarDetails.css';

const translations = {
  en: {
    brand: 'Brand',
    year: 'Year',
    model: 'Model',
    mileage: 'Mileage',
    capacity: 'Engine Capacity',
    condition: 'Price per day',
    back: 'Back'
  },
  ro: {
    brand: 'Marcă',
    year: 'An',
    model: 'Model',
    mileage: 'Rulaj',
    capacity: 'Capacitate cilindrică',
    condition: 'Pret pe zi',
    back: 'Înapoi'
  }
};

const CarDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { car, language } = location.state || { car: {}, language: 'en' };

  const t = translations[language];

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="car-details-container">
      <h1>{car.brand}</h1>
      <img src={`${process.env.PUBLIC_URL}/${car.image}`} alt={car.brand} />
      <p>{`${t.model}: ${car.model}`}</p>
      <p>{`${t.year}: ${car.year}`}</p>
      <p>{`${t.mileage}: ${car.mileage}`}</p>
      <p>{`${t.capacity}: ${car.capacity}`}</p>
      <p>{`${t.condition}: ${car.conditie}`}</p>
      <button className="back-button" onClick={handleBackClick}>{t.back}</button>
    </div>
  );
};

export default CarDetails;
