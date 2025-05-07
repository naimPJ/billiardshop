const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Registracija
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        // Provjera da li korisnik već postoji
        const [existingUser] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Korisnik sa ovim emailom već postoji' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Unos u Users tabelu
        const [result] = await db.query(
            'INSERT INTO Users (name, email, passwordHash, phone, address) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, address]
        );

        // Unos u Customer tabelu
        await db.query('INSERT INTO Customer (id) VALUES (?)', [result.insertId]);

        res.status(201).json({ message: 'Korisnik uspješno registrovan' });
    } catch (error) {
        console.error('Greška pri registraciji:', error);
        res.status(500).json({ message: 'Greška pri registraciji', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Pronađi korisnika
        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Pogrešan email ili lozinka' });
        }

        const user = users[0];

        // Provjeri password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Pogrešan email ili lozinka' });
        }

        // Provjeri da li je korisnik admin
        const [adminResult] = await db.query('SELECT * FROM Admin WHERE id = ?', [user.id]);
        const isAdmin = adminResult.length > 0;

        res.json({
            message: 'Uspješna prijava',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: isAdmin
            }
        });
    } catch (error) {
        console.error('Greška pri prijavi:', error);
        res.status(500).json({ message: 'Greška pri prijavi', error: error.message });
    }
});

module.exports = router; 