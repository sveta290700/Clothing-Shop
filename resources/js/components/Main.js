import React, { useState, useEffect } from 'react';
import { Navbar, Products, Cart, ProductPage, Checkout } from '../components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { commerce } from '../lib/commerce';

import '../styles.sass';

import ReactDOM from 'react-dom';

const Main = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [categories, setCategories] = useState([]);

    const fetchProducts = () => {
        fetch("http://127.0.0.1:8000/api/products")
            .then(res => res.json())
            .then(
                (result) => {
                    setProducts(result.data);
                    },
                (error) => {
                    console.log('Error');
                }
                )
    }

    const fetchCategories = async () => {
        const { data: categories } = await commerce.categories.list();
        setCategories(categories);
    };

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    };

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    };

    const handleAddToCart = async (productId, quantity, secondClickFlag) => {
        if (!secondClickFlag) {
            const { cart } = await commerce.cart.add(productId, quantity);
            console.log(cart);
            setCart(cart);
        }
    };

    const handleUpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity });
        setCart(cart);
    };

    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);
        setCart(cart);
    };

    const handleEmptyCart = async () => {
        const response = await commerce.cart.empty();
        setCart(response.cart);
    };

    const handleCaptureCheckout = async (newOrder) => {
        console.log(newOrder);
        handleEmptyCart();
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchCart();
    }, []);

    return (
        <Router>
            <div className="pageContent">
                <Navbar totalItems={cart.total_items} />
                <Switch>
                    <Route exact path="/">
                        <Products products={products} categories={categories} onAddToCart={handleAddToCart} />
                    </Route>
                    <Route exact path="/cart">
                        <Cart
                            cart={cart}
                            handleUpdateCartQty={handleUpdateCartQty}
                            handleRemoveFromCart={handleRemoveFromCart}
                        />
                    </Route>
                    <Route exact path="/product/:id">
                        <ProductPage onAddToCart={handleAddToCart} />
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default Main;

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'));
}
