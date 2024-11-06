// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList({ addToCart }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="product-list">
            {products.map(product => (
                <div key={product._id} className="product-card">
                    <img src={product.imageUrl} alt={product.name} />
                    <div className="details">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p className="price">${product.price.toFixed(2)}</p>
                        <button onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductList;
