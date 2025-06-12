const request = require('supertest');
const express = require('express');
const cartRoutes = require('../routes/cart');
const db = require('../config/db');

// Mock database response
jest.mock('../config/db', () => ({
  query: jest.fn(),
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/cart', cartRoutes);

describe('Cart API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/cart/:customerId/items', () => {
    it('should add a new product to cart successfully', async () => {
      const customerId = 1;
      const productToAdd = {
        productId: 1,
        quantity: 2
      };

      // Mock existing cart
      db.query
        .mockResolvedValueOnce([[{ id: 1, customerId: 1 }]]) // Get cart
        .mockResolvedValueOnce([[]]); // Check if product exists in cart (empty result)

      // Make request
      const response = await request(app)
        .post(`/api/cart/${customerId}/items`)
        .send(productToAdd)
        .expect('Content-Type', /json/)
        .expect(201);

      // Assertions
      expect(db.query).toHaveBeenCalledTimes(3); // Get cart, check product, insert product
      expect(response.body).toHaveProperty('message', 'Product added to cart');
    });

    it('should update quantity if product already exists in cart', async () => {
      const customerId = 1;
      const productToAdd = {
        productId: 1,
        quantity: 2
      };

      // Mock existing cart and product
      db.query
        .mockResolvedValueOnce([[{ id: 1, customerId: 1 }]]) // Get cart
        .mockResolvedValueOnce([[{ cartId: 1, productId: 1, quantity: 1 }]]); // Product exists

      // Make request
      const response = await request(app)
        .post(`/api/cart/${customerId}/items`)
        .send(productToAdd)
        .expect('Content-Type', /json/)
        .expect(201);

      // Assertions
      expect(db.query).toHaveBeenCalledTimes(3); // Get cart, check product, update quantity
      expect(response.body).toHaveProperty('message', 'Product added to cart');
    });
  });

  describe('DELETE /api/cart/:customerId/items/:productId', () => {
    it('should remove product from cart successfully', async () => {
      const customerId = 1;
      const productId = 1;

      // Mock existing cart and product
      db.query
        .mockResolvedValueOnce([[{ id: 1, customerId: 1 }]]) // Get cart
        .mockResolvedValueOnce([[{ cartId: 1, productId: 1 }]]) // Product exists
        .mockResolvedValueOnce([[]]) // Delete product
        .mockResolvedValueOnce([[]]); // Get updated cart items

      // Make request
      const response = await request(app)
        .delete(`/api/cart/${customerId}/items/${productId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      // Assertions
      expect(db.query).toHaveBeenCalledTimes(4);
      expect(response.body).toHaveProperty('message', 'Product removed from cart');
      expect(response.body).toHaveProperty('cartItems');
    });

    it('should return 404 if cart not found', async () => {
      const customerId = 999;
      const productId = 1;

      // Mock empty cart result
      db.query.mockResolvedValueOnce([[]]);

      // Make request
      const response = await request(app)
        .delete(`/api/cart/${customerId}/items/${productId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      // Assertions
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', 'Cart not found');
    });

    it('should return 404 if product not in cart', async () => {
      const customerId = 1;
      const productId = 999;

      // Mock existing cart but no product
      db.query
        .mockResolvedValueOnce([[{ id: 1, customerId: 1 }]]) // Get cart
        .mockResolvedValueOnce([[]]); // Product doesn't exist in cart

      // Make request
      const response = await request(app)
        .delete(`/api/cart/${customerId}/items/${productId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      // Assertions
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(response.body).toHaveProperty('message', 'Product not found in cart');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors when adding product', async () => {
      const customerId = 1;
      const productToAdd = {
        productId: 1,
        quantity: 2
      };

      // Mock database error
      db.query.mockRejectedValueOnce(new Error('Database error'));

      // Make request
      const response = await request(app)
        .post(`/api/cart/${customerId}/items`)
        .send(productToAdd)
        .expect('Content-Type', /json/)
        .expect(500);

      // Assertions
      expect(response.body).toHaveProperty('message', 'Error adding to cart');
      expect(response.body).toHaveProperty('error');
    });

    it('should handle database errors when removing product', async () => {
      const customerId = 1;
      const productId = 1;

      // Mock database error
      db.query.mockRejectedValueOnce(new Error('Database error'));

      // Make request
      const response = await request(app)
        .delete(`/api/cart/${customerId}/items/${productId}`)
        .expect('Content-Type', /json/)
        .expect(500);

      // Assertions
      expect(response.body).toHaveProperty('message', 'Error removing from cart');
      expect(response.body).toHaveProperty('error');
    });
  });
}); 