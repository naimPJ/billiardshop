const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Dohvati sve proizvode
router.get('/', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM Product');
        
        // Konvertuj cijene u brojeve
        const formattedProducts = products.map(product => ({
            ...product,
            price: parseFloat(product.price)
        }));
        
        res.json(formattedProducts);
    } catch (error) {
        console.error('Greška pri dohvatanju proizvoda:', error);
        res.status(500).json({ message: 'Greška pri dohvatanju proizvoda', error: error.message });
    }
});

module.exports = router; 