import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError(language === 'en' ? 'Please enter a valid email address!' : 'Te rugăm introdu o adresă validă de email!');
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError(language === 'en' ? 'Passwords do not match!' : 'Parolele nu corespund!');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/register', { email, password, first_name: firstName, last_name: lastName });
        localStorage.setItem('token', response.data.token);
        navigate('/home', { state: { email } });
      } catch (error) {
        setError(error.response.data.msg);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/login', { email, password });
        localStorage.setItem('token', response.data.token);
        navigate('/home', { state: { email } });
      } catch (error) {
        setError(error.response.data.msg);
      }
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">{language === 'en' ? 'Welcome to' : 'Bine ai venit la'} <span className="brand">EasyCars!</span></h1>
        <p className="subtitle">
          {language === 'en'
            ? "We're glad to see you back! Log in to your account to view our new car collection!"
            : 'Ne bucurăm să te vedem din nou! Intră în contul tău pentru a vedea noua noastră colecție de mașini!'}
        </p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{language === 'en' ? 'Email' : 'Email'}</label>
            <input type="text" value={email} onChange={handleEmailChange} />
          </div>
          <div className="input-group">
            <label>{language === 'en' ? 'Password' : 'Parola'}</label>
            <input type="password" value={password} onChange={handlePasswordChange} required />
          </div>
          <button type="submit" className="login-button">{language === 'en' ? 'Log in' : 'Intră în cont'}</button>
        </form>
        <div className="divider"></div>
        <div className="signup-section">
          <h2>
            {language === 'en'
              ? "Don't have an account? No problem! Just Sign Up down below!"
              : 'Nu ai un cont? Nicio problemă! Înregistrează-te mai jos!'}
          </h2>
          <button onClick={toggleSignUp} className="signup-button">{language === 'en' ? 'Sign Up' : 'Înregistrează-te'}</button>
        </div>
      </div>
      {isSignUp && (
        <div className="signup-modal">
          <div className="signup-box">
            <h1>{language === 'en' ? 'Create Account' : 'Creează cont'}</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>{language === 'en' ? 'First Name' : 'Nume'}</label>
                <input type="text" value={firstName} onChange={handleFirstNameChange} required />
              </div>
              <div className="input-group">
                <label>{language === 'en' ? 'Last Name' : 'Prenume'}</label>
                <input type="text" value={lastName} onChange={handleLastNameChange} required />
              </div>
              <div className="input-group">
                <label>{language === 'en' ? 'Email' : 'Email'}</label>
                <input type="text" value={email} onChange={handleEmailChange} />
              </div>
              <div className="input-group">
                <label>{language === 'en' ? 'Password' : 'Parola'}</label>
                <input type="password" value={password} onChange={handlePasswordChange} required />
              </div>
              <div className="input-group">
                <label>{language === 'en' ? 'Confirm Password' : 'Confirmă Parola'}</label>
                <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
              </div>
              <button type="submit" className="signup-button">{language === 'en' ? 'Create Account' : 'Creează cont'}</button>
            </form>
            <button onClick={toggleSignUp} className="close-button">{language === 'en' ? 'Close' : 'Închide'}</button>
          </div>
        </div>
      )}
      <div className="language-selector">
        <button onClick={() => handleLanguageChange('en')} className={`language-button ${language === 'en' ? 'active' : ''}`}>English</button>
        <button onClick={() => handleLanguageChange('ro')} className={`language-button ${language === 'ro' ? 'active' : ''}`}>Română</button>
      </div>
    </div>
  );
};

export default LoginPage;
