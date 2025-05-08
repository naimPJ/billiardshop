import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, checkout } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    
    try {
      const orderId = await checkout(shippingAddress);
      if (orderId) {
        navigate('/order-confirmation', { state: { orderId } });
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.productId} className="cart-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="price">${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="item-total">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                  <button className="remove-item" onClick={() => removeFromCart(item.productId)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {!isCheckingOut ? (
              <button 
                className="checkout-button"
                onClick={() => setIsCheckingOut(true)}
              >
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="checkout-form">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="checkout-button"
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : 'Complete Order'}
                </button>
                <button 
                  type="button"
                  className="back-button"
                  onClick={() => setIsCheckingOut(false)}
                >
                  Back to Cart
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Cart; 