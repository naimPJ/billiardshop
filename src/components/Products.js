import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      if (!response.ok) throw new Error('Greška pri dohvatanju proizvoda');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Greška:', error);
      toast.error('Nije moguće dohvatiti proizvode');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Učitavanje proizvoda...</div>;
  }

  return (
    <div className="products-page">
      <h1>Our Products</h1>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="description">{product.description}</p>
            <p className="stock">In Stock: {product.inStock}</p>
            <button 
              className="add-to-cart"
              onClick={() => addToCart(product)}
              disabled={product.inStock === 0}
            >
              {product.inStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products; 