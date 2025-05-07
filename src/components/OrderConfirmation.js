import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return (
      <div className="order-confirmation">
        <h1>Greška</h1>
        <p>Narudžba nije pronađena.</p>
        <Link to="/" className="home-button">Povratak na početnu</Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="success-icon">
        <FontAwesomeIcon icon={faCheckCircle} />
      </div>
      <h1>Hvala na narudžbi!</h1>
      <p>Vaša narudžba je uspješno kreirana.</p>
      <p className="order-id">Broj narudžbe: #{orderId}</p>
      <p>Poslat ćemo vam email sa detaljima vaše narudžbe.</p>
      <div className="action-buttons">
        <Link to="/products" className="continue-shopping">
          Nastavi kupovinu
        </Link>
        <Link to="/" className="home-button">
          Povratak na početnu
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation; 