// src/components/Cart.js
import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ cart, updateQuantity, removeFromCart }) {
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty. <Link to="/">Go shopping</Link></p>
            ) : (
                <div>
                    {cart.map(item => (
                        <div key={item._id} className="cart-item">
                            <h3>{item.name}</h3>
                            <p>Price: ${item.price}</p>
                            <p>
                                Quantity: 
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                                />
                            </p>
                            <button onClick={() => removeFromCart(item._id)}>Remove</button>
                        </div>
                    ))}
                    <h3>Total: ${calculateTotal()}</h3>
                    <Link to="/checkout">
                        <button>Proceed to Checkout</button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Cart;
