// src/components/Checkout.js
import React, { useState } from 'react';
import axios from 'axios';

function Checkout({ cart }) {
    const [user, setUser] = useState({ name: '', email: '', address: '' });
    const [orderPlaced, setOrderPlaced] = useState(false);

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        const orderData = {
            user,
            products: cart.map(item => ({
                productId: item._id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: parseFloat(calculateTotal())
        };

        try {
            const response = await axios.post('http://localhost:5000/api/orders', orderData);
            alert(`Order placed! Order ID: ${response.data._id}`);
            setOrderPlaced(true);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order');
        }
    };

    if (orderPlaced) {
        return <h2>Thank you for your order!</h2>;
    }

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            <h3>Order Summary</h3>
            <ul>
                {cart.map(item => (
                    <li key={item._id}>{item.name} - Quantity: {item.quantity}</li>
                ))}
            </ul>
            <h3>Total: ${calculateTotal()}</h3>

            <form onSubmit={handleSubmitOrder}>
                <h3>Shipping Details</h3>
                <label>
                    Name:
                    <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
                </label>
                <label>
                    Email:
                    <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                </label>
                <label>
                    Address:
                    <textarea value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} required />
                </label>
                <button type="submit">Place Order</button>
            </form>
        </div>
    );
}

export default Checkout;
