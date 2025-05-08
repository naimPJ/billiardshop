const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get user's cart
router.get('/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        // First get or create cart for user
        let [cart] = await db.query('SELECT * FROM Cart WHERE customerId = ?', [customerId]);
        
        if (cart.length === 0) {
            // Create new cart if it doesn't exist
            const [result] = await db.query('INSERT INTO Cart (customerId) VALUES (?)', [customerId]);
            cart = [{ id: result.insertId, customerId }];
        }

        // Get all products in cart
        const [cartItems] = await db.query(`
            SELECT 
                ci.productId,
                ci.quantity,
                p.name,
                p.price,
                p.imageUrl
            FROM CartItem ci
            JOIN Product p ON ci.productId = p.id
            WHERE ci.cartId = ?
        `, [cart[0].id]);

        // Convert prices to numbers
        const formattedCartItems = cartItems.map(item => ({
            ...item,
            price: parseFloat(item.price)
        }));

        res.json(formattedCartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

// Add product to cart
router.post('/:customerId/items', async (req, res) => {
    try {
        const { customerId } = req.params;
        const { productId, quantity } = req.body;

        // Get or create cart
        let [cart] = await db.query('SELECT * FROM Cart WHERE customerId = ?', [customerId]);
        
        if (cart.length === 0) {
            const [result] = await db.query('INSERT INTO Cart (customerId) VALUES (?)', [customerId]);
            cart = [{ id: result.insertId }];
        }

        // Check if product already exists in cart
        const [existingItem] = await db.query(
            'SELECT * FROM CartItem WHERE cartId = ? AND productId = ?',
            [cart[0].id, productId]
        );

        if (existingItem.length > 0) {
            // Update quantity
            await db.query(
                'UPDATE CartItem SET quantity = quantity + ? WHERE cartId = ? AND productId = ?',
                [quantity, cart[0].id, productId]
            );
        } else {
            // Add new product
            await db.query(
                'INSERT INTO CartItem (cartId, productId, quantity) VALUES (?, ?, ?)',
                [cart[0].id, productId, quantity]
            );
        }

        res.status(201).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
});

// Update product quantity in cart
router.put('/:customerId/items/:productId', async (req, res) => {
    try {
        const { customerId, productId } = req.params;
        const { quantity } = req.body;

        const [cart] = await db.query('SELECT * FROM Cart WHERE customerId = ?', [customerId]);
        if (cart.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Check if product exists in cart
        const [cartItem] = await db.query(
            'SELECT * FROM CartItem WHERE cartId = ? AND productId = ?',
            [cart[0].id, productId]
        );

        if (cartItem.length === 0) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await db.query(
            'UPDATE CartItem SET quantity = ? WHERE cartId = ? AND productId = ?',
            [quantity, cart[0].id, productId]
        );

        // Get updated data after PUT request
        const [updatedCartItems] = await db.query(`
            SELECT 
                ci.productId,
                ci.quantity,
                p.name,
                p.price,
                p.imageUrl
            FROM CartItem ci
            JOIN Product p ON ci.productId = p.id
            WHERE ci.cartId = ?
        `, [cart[0].id]);

        res.json({
            message: 'Quantity updated',
            cartItems: updatedCartItems.map(item => ({
                ...item,
                price: parseFloat(item.price)
            }))
        });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Error updating quantity', error: error.message });
    }
});

// Remove product from cart
router.delete('/:customerId/items/:productId', async (req, res) => {
    try {
        const { customerId, productId } = req.params;

        const [cart] = await db.query('SELECT * FROM Cart WHERE customerId = ?', [customerId]);
        if (cart.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Check if product exists in cart
        const [cartItem] = await db.query(
            'SELECT * FROM CartItem WHERE cartId = ? AND productId = ?',
            [cart[0].id, productId]
        );

        if (cartItem.length === 0) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await db.query(
            'DELETE FROM CartItem WHERE cartId = ? AND productId = ?',
            [cart[0].id, productId]
        );

        // Get updated data after DELETE request
        const [updatedCartItems] = await db.query(`
            SELECT 
                ci.productId,
                ci.quantity,
                p.name,
                p.price,
                p.imageUrl
            FROM CartItem ci
            JOIN Product p ON ci.productId = p.id
            WHERE ci.cartId = ?
        `, [cart[0].id]);

        res.json({
            message: 'Product removed from cart',
            cartItems: updatedCartItems.map(item => ({
                ...item,
                price: parseFloat(item.price)
            }))
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
});

// Checkout route
router.post('/:customerId/checkout', async (req, res) => {
    try {
        const { customerId } = req.params;
        const { shippingAddress } = req.body;

        // Start transaction
        await db.beginTransaction();

        try {
            // Get cart
            const [cart] = await db.query('SELECT * FROM Cart WHERE customerId = ?', [customerId]);
            if (cart.length === 0) {
                throw new Error('Cart not found');
            }

            // Get products from cart
            const [cartItems] = await db.query(`
                SELECT ci.*, p.name, p.price, p.inStock
                FROM CartItem ci
                JOIN Product p ON ci.productId = p.id
                WHERE ci.cartId = ?
            `, [cart[0].id]);

            // Convert prices to numbers and check product availability
            const formattedCartItems = cartItems.map(item => ({
                ...item,
                price: parseFloat(item.price)
            }));

            // Check product availability
            for (const item of formattedCartItems) {
                if (item.quantity > item.inStock) {
                    throw new Error(`Product ${item.name} is out of stock`);
                }
            }

            // Create order
            const [orderResult] = await db.query(`
                INSERT INTO \`Order\` (customerId, totalAmount, shippingAddress, status)
                VALUES (?, ?, ?, 'PENDING')
            `, [customerId, formattedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), shippingAddress]);

            // Add order items
            for (const item of formattedCartItems) {
                await db.query(`
                    INSERT INTO OrderItem (orderId, productId, quantity, price)
                    VALUES (?, ?, ?, ?)
                `, [orderResult.insertId, item.productId, item.quantity, item.price]);

                // Update product stock
                await db.query(`
                    UPDATE Product
                    SET inStock = inStock - ?
                    WHERE id = ?
                `, [item.quantity, item.productId]);
            }

            // Clear cart
            await db.query('DELETE FROM CartItem WHERE cartId = ?', [cart[0].id]);

            // Commit transaction
            await db.commit();

            res.status(201).json({
                message: 'Order successfully created',
                orderId: orderResult.insertId
            });
        } catch (error) {
            // Rollback transaction in case of error
            await db.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Error during checkout', error: error.message });
    }
});

module.exports = router; 