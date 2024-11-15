// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
    const [cart, setCart] = useState([]);

    // Add item to cart or update quantity
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item._id === product._id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    // Update quantity in cart
    const updateQuantity = (productId, quantity) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
    };

    return (
        <Router>
            <div className="App">
                <header className="header">
                    <h1>Recipe Realm</h1>
                    <nav>
                        <Link to="/">Products</Link>
                        <Link to="/cart">Cart ({cart.length})</Link>
                    </nav>
                </header>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<ProductList addToCart={addToCart} />} />
                        <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
                        <Route path="/checkout" element={<Checkout cart={cart} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
