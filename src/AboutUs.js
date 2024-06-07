import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AboutUs.css';

const translations = {
  en: {
    aboutTitle: 'About Us',
    aboutText: 'EasyCars is a leading car rental service providing a wide range of cars for every need. Our mission is to offer high-quality vehicles at competitive prices. Whether you need a luxury car for a special occasion or a budget-friendly option for a road trip, EasyCars has you covered.',
    back: 'Back',
    contactUs: 'Contact us at',
    phoneNumber: '+40 712 456 390'
  },
  ro: {
    aboutTitle: 'Despre Noi',
    aboutText: 'EasyCars este un serviciu de închiriere auto de top, oferind o gamă largă de mașini pentru orice nevoie. Misiunea noastră este să oferim vehicule de înaltă calitate la prețuri competitive. Fie că aveți nevoie de o mașină de lux pentru o ocazie specială sau de o opțiune economică pentru o excursie, EasyCars vă acoperă.',
    back: 'Înapoi',
    contactUs: 'Contactați-ne la',
    phoneNumber: '+40 712 456 390'
  }
};

const AboutUs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = location.state?.language || 'en';
  const t = translations[language];

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="about-container">
      <h1>{t.aboutTitle}</h1>
      <p>{t.aboutText}</p>
      <button className="back-button" onClick={handleBackClick}>{t.back}</button>
      <div className="contact-info">
        {t.contactUs} {t.phoneNumber}
      </div>
    </div>
  );
};

export default AboutUs;
