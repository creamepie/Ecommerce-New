require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

// Connect to MongoDB with enhanced logging
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
        console.log('Connection string:', MONGO_URI);
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// Product Schema & Model
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Order Schema & Model
const orderSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // Pending, Shipped, Delivered
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);


// Admin Routes

// Place an order
app.post('/api/orders', async (req, res) => {
    const { user, products } = req.body;

    try {
        if (!user || !products || !products.length) {
            return res.status(400).json({ message: 'User info and products are required' });
        }

        // Calculate total amount
        const totalAmount = products.reduce((total, item) => total + item.quantity * item.price, 0);

        const newOrder = new Order({ user, products, totalAmount });
        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

// Get all orders (admin route)
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('products.productId');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Get user orders
app.get('/api/orders/:userEmail', async (req, res) => {
    try {
        const userEmail = req.params.userEmail;
        const userOrders = await Order.find({ 'user.email': userEmail }).populate('products.productId');
        res.json(userOrders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Failed to fetch user orders' });
    }
});

// Delete (Complete) an order by ID
app.delete('/api/admin/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is valid (24-character hex string for MongoDB)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(`Invalid ID format: ${id}`);
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // Attempt to find and delete the order by ID
        const deletedOrder = await Order.findByIdAndDelete(id);

        // Check if order was found and deleted
        if (!deletedOrder) {
            console.log(`Order not found for ID: ${id}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log('Order completed and deleted:', deletedOrder);
        res.json({ message: 'Order completed and deleted successfully' });
    } catch (error) {
        console.error('Error completing order:', error);
        res.status(500).json({ message: 'Failed to complete order', error: error.message });
    }
});

//route to test MongoDB connection(debuging)
app.get('/api/test', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.json({ message: 'MongoDB is connected', count: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all products
app.get('/api/admin/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// Add a new product
app.post('/api/admin/products', async (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    console.log('Received product data:', req.body);
    
    try {
        // Validate required fields
        if (!name || !description || !price || !imageUrl) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                message: 'All fields are required',
                receivedData: req.body 
            });
        }

        // Validate price is a positive number
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ 
                message: 'Price must be a positive number',
                receivedData: price 
            });
        }

        const newProduct = new Product({ name, description, price, imageUrl });
        console.log('Created product object:', newProduct);
        
        const savedProduct = await newProduct.save();
        console.log('Saved product:', savedProduct);
        
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            message: 'Failed to add product',
            error: error.message 
        });
    }
});



// Update a product
app.put('/api/admin/products/:id', async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        
        if (!name || !description || !price || !imageUrl) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, imageUrl },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product updated:', updatedProduct);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }
});

// Public Routes
// Get all products (for customers)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// Get a single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
});

//console log


// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

