const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/coffeeDB')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const orderSchema = new mongoose.Schema({
    items: Array,
    total: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

// API: Save order
app.post('/api/order', async (req, res) => {
    try {
        const { items, total } = req.body;

        const newOrder = new Order({
            items,
            total
        });

        await newOrder.save();

        res.json({ message: "Order saved successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error saving order" });
    }
});

// API: Get all orders
app.get('/api/orders', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// Open frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});