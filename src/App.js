import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Products from './components/Products';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import OrderConfirmation from './components/OrderConfirmation';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


function AppContent() {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <header className="header">
        <h1>Billiard Shop</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li className="cart-icon">
              <Link to="/cart">
                <FontAwesomeIcon icon={faShoppingCart} />
                <span className="cart-count">{getCartCount()}</span>
              </Link>
            </li>
            <li className="auth-icon">
              {user ? (
                <div className="user-menu">
                <span>{user.name}</span>
                <button onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faRightFromBracket} title="Logout" size="lg" />
                </button>
              </div>
              
              ) : (
                <Link to="/login">
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <section className="hero">
                <h2>Welcome to Billiard Shop</h2>
                <p>The best selection of billiard equipment in the region</p>
                <Link to="/products">
                  <button className="cta-button">View Products</button>
                </Link>
              </section>

              <section className="features">
                <div className="feature">
                  <h3>Quality</h3>
                  <p>Top quality products from renowned manufacturers</p>
                </div>
                <div className="feature">
                  <h3>Service</h3>
                  <p>Professional service and support for all customers</p>
                </div>
                <div className="feature">
                  <h3>Delivery</h3>
                  <p>Fast and secure delivery to your address</p>
                </div>
              </section>
            </>
          } />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer>
        <p>&copy; 2024 Billiard Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
