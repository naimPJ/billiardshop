const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Dohvati košaricu korisnika
router.get('/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        // Prvo dohvati ili kreiraj košaricu za korisnika
        let [cart] = await db.query('SELECT * FROM Cart WHERE customerId = ?', [customerId]);
        
        if (cart.length === 0) {
            // Kreiraj novu košaricu ako ne postoji
            const [result] = await db.query('INSERT INTO Cart (customerId) VALUES (?)', [customerId]);
            cart = [{ id: result.insertId, customerId }];
        }

        // Dohvati sve proizvode u košarici
        const [cartItems] = await db.query(`
            SELECT ci.*, p.name, p.price, p.imageUrl
            FROM CartItem ci
            JOIN Product p ON ci.productId = p.id
            WHERE ci.cartId = ?
        `, [cart[0].id]);

        // Konvertuj cijene u brojeve
        const formattedCartItems = cartItems.map(item => ({
            ...item,
            price: parseFloat(item.price)
        }));

        res.json(formattedCartItems);
    } catch (error) {
        console.error('Greška pri dohvatanju košarice:', error);
        res.status(500).json({ message: 'Greška pri dohvatanju košarice', error: error.message });
    }
});

// Dodaj proizvod u košaricu
router.post('/:customerId/items', async (req, res) => {
    try {
        const { customerId } = req.params;
        const { productId, quantity } = req.body;

        // Dohvati ili kreiraj košaricu
        let [cart] = await db.query('SELECT * FROM Cart WHERE customerId = ?', [customerId]);
        
        if (cart.length === 0) {
            const [result] = await db.query('INSERT INTO Cart (customerId) VALUES (?)', [customerId]);
            cart = [{ id: result.insertId }];
        }

        // Provjeri da li proizvod već postoji u košarici
        const [existingItem] = await db.query(
            'SELECT * FROM CartItem WHERE cartId = ? AND productId = ?',
            [cart[0].id, productId]
        );

        if (existingItem.length > 0) {
            // Ažuriraj količinu
            await db.query(
                'UPDATE CartItem SET quantity = quantity + ? WHERE cartId = ? AND productId = ?',
                [quantity, cart[0].id, productId]
            );
        } else {
            // Dodaj novi proizvod
            await db.query(
                'INSERT INTO CartItem (cartId, productId, quantity) VALUES (?, ?, ?)',
                [cart[0].id, productId, quantity]
            );
        }

        res.status(201).json({ message: 'Proizvod dodan u košaricu' });
    } catch (error) {
        console.error('Greška pri dodavanju u košaricu:', error);
        res.status(500).json({ message: 'Greška pri dodavanju u košaricu', error: error.message });
    }
});

// Ažuriraj količinu proizvoda u košarici
router.put('/:customerId/items/:productId', async (req, res) => {
    try {
        const { customerId, productId } = req.params;
        const { quantity } = req.body;

        const [cart] = await db.query('SELECT * FROM Cart WHERE customerId = ?', [customerId]);
        if (cart.length === 0) {
            return res.status(404).json({ message: 'Košarica nije pronađena' });
        }

        await db.query(
            'UPDATE CartItem SET quantity = ? WHERE cartId = ? AND productId = ?',
            [quantity, cart[0].id, productId]
        );

        res.json({ message: 'Količina ažurirana' });
    } catch (error) {
        console.error('Greška pri ažuriranju količine:', error);
        res.status(500).json({ message: 'Greška pri ažuriranju količine', error: error.message });
    }
});

// Ukloni proizvod iz košarice
router.delete('/:customerId/items/:productId', async (req, res) => {
    try {
        const { customerId, productId } = req.params;

        const [cart] = await db.query('SELECT * FROM Cart WHERE customerId = ?', [customerId]);
        if (cart.length === 0) {
            return res.status(404).json({ message: 'Košarica nije pronađena' });
        }

        await db.query(
            'DELETE FROM CartItem WHERE cartId = ? AND productId = ?',
            [cart[0].id, productId]
        );

        res.json({ message: 'Proizvod uklonjen iz košarice' });
    } catch (error) {
        console.error('Greška pri uklanjanju iz košarice:', error);
        res.status(500).json({ message: 'Greška pri uklanjanju iz košarice', error: error.message });
    }
});

// Checkout ruta
router.post('/:customerId/checkout', async (req, res) => {
    try {
        const { customerId } = req.params;
        const { shippingAddress, paymentDetails } = req.body;

        // Započni transakciju
        await db.beginTransaction();

        try {
            // Dohvati košaricu
            const [cart] = await db.query('SELECT * FROM Cart WHERE customerId = ?', [customerId]);
            if (cart.length === 0) {
                throw new Error('Košarica nije pronađena');
            }

            // Dohvati proizvode iz košarice
            const [cartItems] = await db.query(`
                SELECT ci.*, p.name, p.price, p.inStock
                FROM CartItem ci
                JOIN Product p ON ci.productId = p.id
                WHERE ci.cartId = ?
            `, [cart[0].id]);

            // Konvertuj cijene u brojeve i provjeri dostupnost proizvoda
            const formattedCartItems = cartItems.map(item => ({
                ...item,
                price: parseFloat(item.price)
            }));

            // Provjeri dostupnost proizvoda
            for (const item of formattedCartItems) {
                if (item.quantity > item.inStock) {
                    throw new Error(`Proizvod ${item.name} nema dovoljno zaliha`);
                }
            }

            // Kreiraj narudžbu
            const [orderResult] = await db.query(`
                INSERT INTO \`Order\` (customerId, totalAmount, shippingAddress, status)
                VALUES (?, ?, ?, 'PENDING')
            `, [customerId, formattedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), shippingAddress]);

            // Dodaj stavke narudžbe
            for (const item of formattedCartItems) {
                await db.query(`
                    INSERT INTO OrderItem (orderId, productId, quantity, price)
                    VALUES (?, ?, ?, ?)
                `, [orderResult.insertId, item.productId, item.quantity, item.price]);

                // Ažuriraj stanje proizvoda
                await db.query(`
                    UPDATE Product
                    SET inStock = inStock - ?
                    WHERE id = ?
                `, [item.quantity, item.productId]);
            }

            // Očisti košaricu
            await db.query('DELETE FROM CartItem WHERE cartId = ?', [cart[0].id]);

            // Potvrdi transakciju
            await db.commit();

            res.status(201).json({
                message: 'Narudžba uspješno kreirana',
                orderId: orderResult.insertId
            });
        } catch (error) {
            // Poništi transakciju u slučaju greške
            await db.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Greška pri checkout-u:', error);
        res.status(500).json({ message: 'Greška pri checkout-u', error: error.message });
    }
});

module.exports = router; 