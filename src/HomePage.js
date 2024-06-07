import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const translations = {
  en: {
    searchPlaceholder: 'Search by brand...',
    availableCars: 'Available Cars',
    aboutUs: 'About Us',
    offers: 'Offers',
    support: 'Support',
    signOut: 'Sign Out',
    moreDetails: 'More Details',
    addToCart: 'Add to Cart',
    cart: 'Cart'
  },
  ro: {
    searchPlaceholder: 'Căutați după marcă...',
    availableCars: 'Mașini disponibile',
    aboutUs: 'Despre noi',
    offers: 'Oferte',
    support: 'Suport',
    signOut: 'Deconectare',
    moreDetails: 'Mai multe detalii',
    addToCart: 'Adaugă în coș',
    cart: 'Coș'
  }
};

const HomePage = ({ addToCart }) => {
  const [cars, setCars] = useState([]);
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      const result = await axios.get('http://localhost:5000/api/cars');
      setCars(result.data);
    };

    fetchCars();
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCars = cars.filter((car) =>
    car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMoreDetailsClick = (car) => {
    navigate('/car-details', { state: { car, language } });
  };

  const handleAddToCart = async (car) => {
    const userId = 1; 
    const startDate = '2024-06-01';
    const endDate = '2024-06-10'; 

    try {
      await axios.post('http://localhost:5000/api/cart', {
        userId,
        carId: car.id,
        startDate,
        endDate
      });
      setAlert(`Added ${car.brand} ${car.model} to cart`);
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAlert('Failed to add to cart');
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const t = translations[language];

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>EasyCars</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>{t.availableCars}</li>
            <li>
              <a href="/about">{t.aboutUs}</a>
            </li>
            <li>
              <a href="/support">{t.support}</a>
            </li>
            <li>
              <a href="/cart">{t.cart}</a>
            </li>
          </ul>
        </nav>
        <button className="signout-button" onClick={() => navigate('/')}>
          {t.signOut}
        </button>
        <div className="language-selector">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`language-button ${language === 'en' ? 'active' : ''}`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('ro')}
            className={`language-button ${language === 'ro' ? 'active' : ''}`}
          >
            Română
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="header">
          <div className="header-info">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bar"
            />
          </div>
        </header>
        <section className="overview">
          {filteredCars.map((car) => (
            <div key={car.id} className="overview-card">
              <img src={`${process.env.PUBLIC_URL}/${car.image}`} alt={car.brand} />
              <h3>{car.brand}</h3>
              <h3>{car.model}</h3>
              <button className="details-button" onClick={() => handleMoreDetailsClick(car)}>
                {t.moreDetails}
              </button>
              <button className="add-to-cart-button" onClick={() => handleAddToCart(car)}>
                {t.addToCart}
              </button>
            </div>
          ))}
        </section>
        {alert && <div className="alert">{alert}</div>}
      </main>
    </div>
  );
};

export default HomePage;
