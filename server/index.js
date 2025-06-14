require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const productRoutes = require('./routes/products');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Dozvoljava pristup sa bilo kojeg domena
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Dozvoljene HTTP metode
  allowedHeaders: ['Content-Type', 'Authorization'], // Dozvoljeni headeri
  credentials: true // Dozvoljava slanje kredencijala (cookies, auth headers)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth rute
app.use('/api/auth', authRoutes);

// Cart rute
app.use('/api/cart', cartRoutes);

// Product rute
app.use('/api/products', productRoutes);

// Test ruta za provjeru konekcije
app.get('/test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.json({ message: 'Konekcija sa bazom je uspješna!', data: rows });
  } catch (error) {
    res.status(500).json({ message: 'Greška pri konekciji sa bazom', error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
}); 