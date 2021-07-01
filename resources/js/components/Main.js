import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Navbar, Products, Cart, ProductPage, Checkout } from '../components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './styles.sass';

const Main = () => {

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [cartList, setCartList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

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
        await fetchCart();
    };

    const filterByCategory = async (idx, radioValue) => {
        if (idx.length !== 0) {
            let filtered = [];
            for (let i = 0; i < idx.length; i++) {
                const response = await fetch("http://127.0.0.1:8000/api/products?category=" + idx[i]);
                const json = await response.json();
                filtered = filtered.concat(json.data);
            }
            if (radioValue !== 'empty')
            {
                switch (radioValue) {
                    case 'descPrice': {
                        sortFilteredProducts(filtered, false, true, false);
                        break;
                    }
                    case 'ascPrice': {
                        sortFilteredProducts(filtered, false, true, false);
                        break;
                    }
                    case 'descName': {
                        sortFilteredProducts(filtered, true, false, true);
                        break;
                    }
                    case 'ascName': {
                        sortFilteredProducts(filtered, false, false, true);
                        break;
                    }
                }
            }
            else
                setProducts(filtered);
        }
        else
            await fetchProducts();
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
        fetchCategories();
        fetchCartList();
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    function sortPrice(a, b) {
        return a.price - b.price;
    }

    function sortName(a, b) {
        return a.name.localeCompare(b.name);
    }

    const sortProducts = (desc, priceSort, nameSort) => {
        const sortedProducts = products.slice();
        if (priceSort) {
            if (desc) {
                sortedProducts.sort(sortPrice).reverse();
                setProducts(sortedProducts);
            }
            else
            {
                sortedProducts.sort(sortPrice)
                setProducts(sortedProducts);
            }
        }
        else if (nameSort) {
            if (desc) {
                sortedProducts.sort(sortName).reverse();
                setProducts(sortedProducts);
            }
            else
            {
                sortedProducts.sort(sortName);
                setProducts(sortedProducts);
            }
        }
        else
            console.log('Incorrect function parameters')
    };

    const sortFilteredProducts = (filtered, desc, priceSort, nameSort) => {
        const sortedProducts = filtered.slice();
        if (priceSort) {
            if (desc) {
                sortedProducts.sort(sortPrice).reverse();
                setProducts(sortedProducts);
            }
            else
            {
                sortedProducts.sort(sortPrice)
                setProducts(sortedProducts);
            }
        }
        else if (nameSort) {
            if (desc) {
                sortedProducts.sort(sortName).reverse();
                setProducts(sortedProducts);
            }
            else
            {
                sortedProducts.sort(sortName);
                setProducts(sortedProducts);
            }
        }
        else
            console.log('Incorrect function parameters')
    };

    return (
        <Router>
            <div className="pageContent">
                <Navbar totalItems={cart.total_quantity}/>
                <Switch>
                    <Route exact path="/">
                        <Products products={currentProducts} categories={categories} onAddToCart={handleAddToCart}
                                  totalProducts={products.length} productsPerPage={productsPerPage}
                                  openPage={currentPage} paginate={paginate} filterByCategory={filterByCategory} sortProducts={sortProducts}/>
                    </Route>
                    <Route exact path="/cart">
                        <Cart
                            cart={cart} cartList={cartList} handleUpdateCart={handleUpdateCart}
                            handleRemoveFromCart={handleRemoveFromCart} refreshProducts={fetchProducts}/>
                    </Route>
                    <Route exact path="/product/:id">
                        <ProductPage onAddToCart={handleAddToCart} refreshProducts={fetchProducts}/>
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout cart={cart} cartList={cartList} onCaptureCheckout={handleCaptureCheckout} refreshProducts={fetchProducts}/>
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
