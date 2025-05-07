import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/cart/${user.id}`);
      if (!response.ok) throw new Error('Greška pri dohvatanju košarice');
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Greška pri dohvatanju košarice:', error);
      toast.error('Nije moguće dohvatiti košaricu');
    }
  }, [user]);

  // Učitaj košaricu kada se korisnik prijavi
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user, fetchCart]);

  const addToCart = useCallback(async (product) => {
    if (!user) {
      toast.error('Morate biti prijavljeni da biste dodali proizvode u košaricu');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/cart/${user.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        })
      });

      if (!response.ok) throw new Error('Greška pri dodavanju u košaricu');

      // Osvježi košaricu nakon dodavanja
      await fetchCart();
      toast.success(`${product.name} dodan u košaricu!`);
    } catch (error) {
      console.error('Greška pri dodavanju u košaricu:', error);
      toast.error('Nije moguće dodati proizvod u košaricu');
    }
  }, [user, fetchCart]);

  const removeFromCart = useCallback(async (productId) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:3001/api/cart/${user.id}/items/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Greška pri uklanjanju iz košarice');

      // Osvježi košaricu nakon uklanjanja
      await fetchCart();
      toast.error('Proizvod uklonjen iz košarice');
    } catch (error) {
      console.error('Greška pri uklanjanju iz košarice:', error);
      toast.error('Nije moguće ukloniti proizvod iz košarice');
    }
  }, [user, fetchCart]);

  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (!user || newQuantity < 1) return;

    try {
      const response = await fetch(`http://localhost:3001/api/cart/${user.id}/items/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) throw new Error('Greška pri ažuriranju količine');

      // Osvježi košaricu nakon ažuriranja
      await fetchCart();
      toast.info('Količina ažurirana');
    } catch (error) {
      console.error('Greška pri ažuriranju količine:', error);
      toast.error('Nije moguće ažurirati količinu');
    }
  }, [user, fetchCart]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const checkout = useCallback(async (shippingAddress) => {
    if (!user) {
      toast.error('Morate biti prijavljeni da biste izvršili kupovinu');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/cart/${user.id}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shippingAddress
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      setCartItems([]); // Očisti lokalnu košaricu
      toast.success('Narudžba uspješno kreirana!');
      return result.orderId;
    } catch (error) {
      console.error('Greška pri checkout-u:', error);
      toast.error(error.message || 'Nije moguće izvršiti kupovinu');
      return null;
    }
  }, [user]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartCount,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 