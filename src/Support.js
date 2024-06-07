import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Support.css';

const translations = {
  en: {
    supportTitle: 'Support',
    supportText: 'If you need assistance, please reach out to us using the form below or contact us at support@easycars.com.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    submit: 'Send',
    back: 'Back',
    contactUs: 'Contact us at',
    phoneNumber: '+40 712 456 390'
  },
  ro: {
    supportTitle: 'Suport',
    supportText: 'Dacă ai nevoie de asistență, te rugăm să ne contactezi folosind formularul de mai jos sau la adresa de email support@easycars.com.',
    name: 'Nume',
    email: 'Email',
    message: 'Mesaj',
    submit: 'Trimite',
    back: 'Înapoi',
    contactUs: 'Contactează-ne la',
    phoneNumber: '+40 712 456 390'
  }
};

const Support = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const language = location.state?.language || 'en';
  const t = translations[language];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser({ name: response.data.name, email: response.data.email });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/support', {
        name: user.name,
        email: user.email,
        message
      });
      alert('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  return (
    <div className="support-container">
      <h1>{t.supportTitle}</h1>
      <p>{t.supportText}</p>
      <form className="support-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>{t.name}</label>
          <input type="text" value={user.name} readOnly />
        </div>
        <div className="input-group">
          <label>{t.email}</label>
          <input type="email" value={user.email} readOnly />
        </div>
        <div className="input-group">
          <label>{t.message}</label>
          <textarea rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
        </div>
        <button type="submit" className="submit-button">{t.submit}</button>
      </form>
      <button className="back-button" onClick={handleBackClick}>{t.back}</button>
    </div>
  );
};

export default Support;
