import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Container } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { commerce } from '../../lib/commerce';

import './styles.sass';

const ProductPage = ({ onAddToCart }) => {

    const [buttonState, setButtonState] = useState({ text: "В корзину", clickCount: 0, secondClickFlag: false });

    function goToCart() {
        if (buttonState.clickCount > 0 && buttonState.secondClickFlag === true)
            window.location = '/cart';
    }

    const [product, setProduct] = useState({});

    const fetchProduct = async (id) => {
        const response = await commerce.products.retrieve(id);
        const { name, price, media, quantity, description } = response;
        setProduct({
            id,
            name,
            quantity,
            description,
            src: media.source,
            price: price.formatted_with_symbol,
        });
    };

    useEffect(() => {
        const id = window.location.pathname.split("/");
        fetchProduct(id[2]);
    }, []);

    return (
        <Container>
            <Typography className="productCardTitle" variant="h3">
                Информация о товаре
            </Typography>
            <Card className="productCard">
                <CardMedia className="productCardMedia" image={product.src} title={product.name} />
                <CardContent>
                    <div className="productCardContent">
                        <Typography className="productCardName">
                            {product.name}
                        </Typography>
                        <Typography className="productCardPrice">
                            {product.price}
                        </Typography>
                    </div>
                    <Typography className="productCardCategory" variant="body2">
                        {product.id}
                    </Typography>
                    <Typography className="productCardDescription" dangerouslySetInnerHTML={{ __html: product.description }} variant="body2" component="p" />
                </CardContent>
                <CardActions disableSpacing className="productCardActions">
                    <Button className="addToCartButton" variant="outlined" color={buttonState.secondClickFlag ? "secondary" : "primary"}
                            onClick={() => { goToCart(); setButtonState({ text: "В корзине", clickCount: ++buttonState.clickCount, secondClickFlag: true }); onAddToCart(product.id, 1, buttonState.secondClickFlag) }}>
                        {buttonState.text}
                    </Button>
                </CardActions>
            </Card>
            <div className="back">
                <Button className="backButton" variant="outlined" component={Link} to="/">
                    Назад
                </Button>
            </div>
        </Container>
    )
};

export default ProductPage;
