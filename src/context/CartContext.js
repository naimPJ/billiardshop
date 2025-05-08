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
      if (!response.ok) throw new Error('Error fetching cart');
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Unable to fetch cart');
    }
  }, [user]);

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user, fetchCart]);

  const addToCart = useCallback(async (product) => {
    if (!user) {
      toast.error('You must be logged in to add items to cart');
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

      if (!response.ok) throw new Error('Error adding to cart');

      // Refresh cart after adding
      await fetchCart();
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Unable to add product to cart');
    }
  }, [user, fetchCart]);

  const removeFromCart = useCallback(async (productId) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:3001/api/cart/${user.id}/items/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      setCartItems(data.cartItems);
      toast.error('Product removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(error.message || 'Unable to remove product from cart');
    }
  }, [user]);

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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      setCartItems(data.cartItems);
      toast.info('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.message || 'Unable to update quantity');
    }
  }, [user]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const checkout = useCallback(async (shippingAddress) => {
    if (!user) {
      toast.error('You must be logged in to checkout');
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
      setCartItems([]); // Clear local cart
      toast.success('Order successfully created!');
      return result.orderId;
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(error.message || 'Unable to complete checkout');
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