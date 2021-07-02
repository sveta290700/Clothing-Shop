import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardActions, Typography, Button, Container, Paper } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import './styles.sass';

const ProductPage = ({ onAddToCart, refreshProducts }) => {

    const history = useHistory();

    const [buttonState, setButtonState] = useState({ text: "В корзину", clickCount: 0, secondClickFlag: false });

    function goToCart() {
        if (buttonState.clickCount > 0 && buttonState.secondClickFlag === true)
            history.push("/cart");
    }

    const [product, setProduct] = useState({});

    const fetchProduct = (id) => {
        fetch("http://127.0.0.1:8000/api/products/" + id)
            .then(res => res.json())
            .then(
                (result) => {
                    setProduct(result.data);
                    },
                (error) => {
                    console.log('Error');
                }
                )
    };

    useEffect(() => {
        const id = window.location.pathname.split("/");
        fetchProduct(id[2]);
        refreshProducts();
    }, []);

    return (
        <Container>
            <Typography className="productCardTitle" variant="h3">
                Информация о товаре
            </Typography>
            <div className="productInfo">
            <Paper className="productImage">
                <img src={product.image} alt={product.name}/>
            </Paper>
            <Card className="productCard">
                <CardContent>
                    <div className="productCardContent">
                        <Typography className="productCardName">
                            {product.name}
                        </Typography>
                        <Typography className="productCardPrice">
                            {product.price}
                        </Typography>
                    </div>
                    <Typography className="productCardCategory">
                        Категория товара: {product.category_name}
                    </Typography>
                    <Typography className="productCardDescription">
                        {product.description}
                    </Typography>
                    <Typography className="productCardCharacteristics">
                        {product.characteristics}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing className="productCardActions">
                    <Button className="addToCartButton" variant="outlined" color={buttonState.secondClickFlag ? "secondary" : "primary"}
                            onClick={() => { setButtonState({ text: "В корзине", clickCount: ++buttonState.clickCount, secondClickFlag: true }); goToCart(); onAddToCart(product.id, 1, buttonState.secondClickFlag)}}>
                        {buttonState.text}
                    </Button>
                </CardActions>
            </Card>
            </div>
            <div className="back">
                <Button className="backButton" variant="outlined" component={Link} to="/">
                    Назад
                </Button>
            </div>
        </Container>
    )
};

export default ProductPage;
