import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Navbar, Products, Cart, ProductPage, Checkout } from '../components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './styles.sass';

const Main = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [cartList, setCartList] = useState([]);
    const [order, setOrder] = useState({});
    const [categories, setCategories] = useState([]);

    const fetchProducts = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        const json = await response.json();
        setProducts(json.data);
    };

    const fetchCategories = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/category");
        const json = await response.json();
        setCategories(json.data);
    };

    const fetchCart = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/cart");
        const json = await response.json();
        setCart(json);
        await fetchCartList();
    };

    const fetchCartList = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/cart");
        const json = await response.json();
        const prodList = { ...json };
        delete prodList.total_quantity;
        delete prodList.total_amount;
        delete prodList[0];
        const prodListArray = Object.values(prodList);
        setCartList(prodListArray);
    };

    const handleAddToCart = async (prodId, quan, secondClickFlag) => {
        if (!secondClickFlag) {
            const addNew = {id: prodId, qty: quan};
            await fetch("http://127.0.0.1:8000/api/cart/add",
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(addNew)
                });
            await fetchCart();
        }
    };

    const handleUpdateCart = async (prodId, quan) => {
        const updateNew = {id: prodId, qty: quan};
        await fetch("http://127.0.0.1:8000/api/cart/update",
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateNew)
            });
        await fetchCart();
    };

    const handleRemoveFromCart = async (prodId) => {
        const removeNew = {id: prodId};
        await fetch("http://127.0.0.1:8000/api/cart/delete",
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(removeNew)
            });
        await fetchCart();
    };

    const handleCaptureCheckout = async (newOrder) => {
        await fetch("http://127.0.0.1:8000/api/cart/submit",
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOrder)
            });
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
        fetchCategories();
        fetchCartList();
    }, []);

    return (
        <Router>
            <div className="pageContent">
                <Navbar totalItems={cart.total_quantity} />
                <Switch>
                    <Route exact path="/">
                        <Products products={products} categories={categories} onAddToCart={handleAddToCart} />
                    </Route>
                    <Route exact path="/cart">
                        <Cart
                            cart={cart} cartList={cartList} handleUpdateCart={handleUpdateCart} handleRemoveFromCart={handleRemoveFromCart}
                        />
                    </Route>
                    <Route exact path="/product/:id">
                        <ProductPage onAddToCart={handleAddToCart} />
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout cart={cart} cartList={cartList} order={order} onCaptureCheckout={handleCaptureCheckout} />
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
