import React, { useState } from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

import './styles.sass';

const Product = ({ product, onAddToCart }) => {

    const [buttonState, setButtonState] = useState({ text: "В корзину", clickCount: 0, secondClickFlag: false });

    function goToCart() {
        if (buttonState.clickCount > 0 && buttonState.secondClickFlag === true)
            window.location = '/cart';
    }

    return (
        <Card className="root">
            <CardMedia className="media" image={product.media.source} title={product.name} component={Link} to={`product/${product.id}`} />
            <CardContent>
                <div className="cardContent">
                    <Typography className="productName" component={Link} to={`product/${product.id}`}>
                        {product.name}
                    </Typography>
                    <Typography className="productPrice">
                        {product.price.formatted_with_symbol}
                    </Typography>
                </div>
                <Typography className="category" variant="body2">
                    {product.category}
                </Typography>
            </CardContent>
            <CardActions disableSpacing className="cardActions">
                <Button className="addToCartButton" variant="outlined" color={buttonState.secondClickFlag ? "secondary" : "primary"}
                        onClick={() => { goToCart(); setButtonState({ text: "В корзине", clickCount: ++buttonState.clickCount, secondClickFlag: true }); onAddToCart(product.id, 1, buttonState.secondClickFlag) }}>
                    {buttonState.text}
                </Button>
            </CardActions>
        </Card>
    );
};

export default Product;
