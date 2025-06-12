const request = require('supertest');
const express = require('express');
const productRoutes = require('../routes/products');
const db = require('../config/db');

// Mock database response
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('Products API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should fetch all products successfully', async () => {
      // Mock data
      const mockProducts = [
        {
          id: 1,
          name: 'Professional Cue',
          description: 'High-quality billiard cue',
          price: '199.99',
          imageUrl: 'cue.jpg',
          inStock: 10
        },
        {
          id: 2,
          name: 'Billiard Balls Set',
          description: 'Professional ball set',
          price: '299.99',
          imageUrl: 'balls.jpg',
          inStock: 5
        }
      ];

      // Setup mock response
      db.query.mockResolvedValueOnce([mockProducts]);

      // Make request
      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);

      // Assertions
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM Product');
      
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        mockProducts.map(product => ({
          ...product,
          price: parseFloat(product.price)
        }))
      );

      // Check specific product properties
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('imageUrl');
      expect(response.body[0]).toHaveProperty('inStock');

      // Verify price conversion
      expect(typeof response.body[0].price).toBe('number');
    });

    it('should handle database errors', async () => {
      // Setup mock error
      const mockError = new Error('Database connection failed');
      db.query.mockRejectedValueOnce(mockError);

      // Make request
      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(500);

      // Assertions
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('message', 'Greška pri dohvatanju proizvoda');
      expect(response.body).toHaveProperty('error');
    });
  });
}); 