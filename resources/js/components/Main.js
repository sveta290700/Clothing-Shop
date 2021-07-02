import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Cart, Checkout, Navbar, ProductPage, Products } from '../components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './styles.sass';

const Main = () => {

    const [products, setProducts] = useState([]);
    const [allProductsInRange, setAllProductsInRange] = useState([]);
    const [allSearchedProducts, setAllSearchedProducts] = useState([]);
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

    function performIntersection(arr1, arr2) {
        return arr1.filter(item1 => arr2.some(item2 => item1.id === item2.id));
    }

    const filterAllByPrice = async (left, right) => {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        const json = await response.json();
        const allProducts = json.data.slice();
        let allProductsInRangeArray = allProducts.filter(value => {return (value.price >= left && value.price <= right)});
        setAllProductsInRange(allProductsInRangeArray);
    };

    const filterByPrice = async (checkedCategories, appliedSort, left, right, reset, isSearched, searchedString) => {
        if (!reset) {
            let filteredByPriceProducts = products.slice();
            filteredByPriceProducts = filteredByPriceProducts.filter(value => {
                return (value.price >= left && value.price <= right);
            });
            setProducts(filteredByPriceProducts);
            await filterAllByPrice(left, right);
        }
        else {
            await filterAllByPrice(left, right);
            await filterByCategory(checkedCategories, appliedSort, false, left, right, isSearched, searchedString);
        }
    };

    const searchAllByName = async (value) => {
        const response = await fetch("http://127.0.0.1:8000/api/products");
        const json = await response.json();
        const allProducts = json.data.slice();
        let allSearchedProductsArray = allProducts.filter(function(el) {
            return (el.name.toLowerCase().indexOf(value.toLowerCase()) > -1 || el.name.indexOf(value) > -1)});
        setAllSearchedProducts(allSearchedProductsArray);
    };

    const searchByName = async (value, checkedCategories, appliedSort, left, right, isFilteredByPrice, reset) => {
        if (!reset) {
            let searchedProducts = products.slice();
            searchedProducts = searchedProducts.filter(function(el) {
                return (el.name.toLowerCase().indexOf(value.toLowerCase()) > -1 || el.name.indexOf(value) > -1)});
            setProducts(searchedProducts);
            await searchAllByName(value);
        }
        else {
            await searchAllByName(" ");
            await filterByCategory(checkedCategories, appliedSort, isFilteredByPrice, left, right, false, " ");
        }
    };

    const filterByCategory = async (idx, radioValue, priceFiltered, left, right, isSearched, searchString) => {
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
                        await sortFilteredProducts(filtered, false, true, false, priceFiltered, left, right, isSearched, searchString);
                        break;
                    }
                    case 'ascPrice': {
                        await sortFilteredProducts(filtered, false, true, false, priceFiltered, left, right, isSearched, searchString);
                        break;
                    }
                    case 'descName': {
                        await sortFilteredProducts(filtered, true, false, true, priceFiltered, left, right, isSearched, searchString);
                        break;
                    }
                    case 'ascName': {
                        await sortFilteredProducts(filtered, false, false, true, priceFiltered, left, right, isSearched, searchString);
                        break;
                    }
                }
            }
            else {
                if (priceFiltered) {
                    await filterAllByPrice(left, right);
                    let intersection = performIntersection(filtered, allProductsInRange);
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        intersection = performIntersection(intersection, allSearchedProducts);
                    }
                    setProducts(intersection);
                }
                else
                {
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        const intersection = performIntersection(filtered, allSearchedProducts);
                        setProducts(intersection);
                    }
                    else
                        setProducts(filtered);
                }
            }
        }
        else if (priceFiltered) {
            if (isSearched)
            {
                await searchAllByName(searchString);
                await filterAllByPrice(left, right);
                const intersection = performIntersection(allProductsInRange, allSearchedProducts);
                setProducts(intersection);
            }
            else {
                await filterAllByPrice(left, right);
                setProducts(allProductsInRange);
            }
        }
        else if (isSearched)
        {
            await searchAllByName(searchString);
            setProducts(allSearchedProducts);
        }
        else
            await fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
        fetchCategories();
        fetchCartList();
    }, []);

    function sortPrice(a, b) {
        return a.price - b.price;
    }

    function sortName(a, b) {
        return a.name.localeCompare(b.name);
    }

    const sortProducts = async (desc, priceSort, nameSort, priceFiltered, left, right, isSearched, searchString) => {
        const sortedProducts = products.slice();
        if (priceSort) {
            if (desc) {
                sortedProducts.sort(sortPrice).reverse();
                if (priceFiltered) {
                    await filterAllByPrice(left, right);
                    let intersection = performIntersection(sortedProducts, allProductsInRange);
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        intersection = performIntersection(intersection, allSearchedProducts);
                    }
                    setProducts(intersection);
                }
                else
                {
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        const intersection  = performIntersection(sortedProducts, allSearchedProducts);
                        setProducts(intersection);
                    }
                    else
                        setProducts(sortedProducts);
                }
            }
            else
            {
                sortedProducts.sort(sortPrice);
                if (priceFiltered) {
                    await filterAllByPrice(left, right);
                    let intersection = performIntersection(sortedProducts, allProductsInRange);
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        intersection = performIntersection(intersection, allSearchedProducts);
                    }
                    setProducts(intersection);
                }
                else
                {
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        const intersection  = performIntersection(sortedProducts, allSearchedProducts);
                        setProducts(intersection);
                    }
                    else
                        setProducts(sortedProducts);
                }
            }
        }
        else if (nameSort) {
            if (desc) {
                sortedProducts.sort(sortName).reverse();
                if (priceFiltered) {
                    await filterAllByPrice(left, right);
                    let intersection = performIntersection(sortedProducts, allProductsInRange);
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        intersection = performIntersection(intersection, allSearchedProducts);
                    }
                    setProducts(intersection);
                }
                else
                {
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        const intersection  = performIntersection(sortedProducts, allSearchedProducts);
                        setProducts(intersection);
                    }
                    else
                        setProducts(sortedProducts);
                }
            }
            else
            {
                sortedProducts.sort(sortName);
                if (priceFiltered) {
                    await filterAllByPrice(left, right);
                    let intersection = performIntersection(sortedProducts, allProductsInRange);
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        intersection = performIntersection(intersection, allSearchedProducts);
                    }
                    setProducts(intersection);
                }
                else
                {
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        const intersection  = performIntersection(sortedProducts, allSearchedProducts);
                        setProducts(intersection);
                    }
                    else
                        setProducts(sortedProducts);
                }
            }
        }
        else
            console.log('Incorrect function parameters')
    };

    const sortFilteredProducts = async (filtered, desc, priceSort, nameSort, priceFiltered, left, right, isSearched, searchString) => {
        const sortedProducts = filtered.slice();
        if (priceSort) {
            if (desc) {
                sortedProducts.sort(sortPrice).reverse();
                if (priceFiltered) {
                    await filterAllByPrice(left, right);
                    let intersection = performIntersection(sortedProducts, allProductsInRange);
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        intersection = performIntersection(intersection, allSearchedProducts);
                    }
                    setProducts(intersection);
                }
                else
                {
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        const intersection  = performIntersection(sortedProducts, allSearchedProducts);
                        setProducts(intersection);
                    }
                    else
                        setProducts(sortedProducts);
                }
            }
            else
            {
                sortedProducts.sort(sortPrice);
                if (priceFiltered) {
                    await filterAllByPrice(left, right);
                    let intersection = performIntersection(sortedProducts, allProductsInRange);
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        intersection = performIntersection(intersection, allSearchedProducts);
                    }
                    setProducts(intersection);
                }
                else
                {
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        const intersection  = performIntersection(sortedProducts, allSearchedProducts);
                        setProducts(intersection);
                    }
                    else
                        setProducts(sortedProducts);
                }
            }
        }
        else if (nameSort) {
            if (desc) {
                sortedProducts.sort(sortName).reverse();
                if (priceFiltered) {
                    await filterAllByPrice(left, right);
                    let intersection = performIntersection(sortedProducts, allProductsInRange);
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        intersection = performIntersection(intersection, allSearchedProducts);
                    }
                    setProducts(intersection);
                }
                else
                {
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        const intersection  = performIntersection(sortedProducts, allSearchedProducts);
                        setProducts(intersection);
                    }
                    else
                        setProducts(sortedProducts);
                }
            }
            else
            {
                sortedProducts.sort(sortName);
                if (priceFiltered) {
                    await filterAllByPrice(left, right);
                    let intersection = performIntersection(sortedProducts, allProductsInRange);
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        intersection = performIntersection(intersection, allSearchedProducts);
                    }
                    setProducts(intersection);
                }
                else
                {
                    if (isSearched)
                    {
                        await searchAllByName(searchString);
                        const intersection  = performIntersection(sortedProducts, allSearchedProducts);
                        setProducts(intersection);
                    }
                    else
                        setProducts(sortedProducts);
                }
            }
        }
        else
            console.log('Incorrect function parameters');
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <Router>
            <div className="pageContent">
                <Navbar totalItems={cart.total_quantity}/>
                <Switch>
                    <Route exact path="/">
                        <Products products={currentProducts} categories={categories} onAddToCart={handleAddToCart}
                                  totalProducts={products.length} productsPerPage={productsPerPage}
                                  openPage={currentPage} paginate={paginate} filterByCategory={filterByCategory} sortProducts={sortProducts}
                                  filterByPrice={filterByPrice} searchByName={searchByName}/>
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
    );
};

export default Main;

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'));
}
