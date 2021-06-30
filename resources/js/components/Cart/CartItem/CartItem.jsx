import React from 'react';
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from '@material-ui/core';

import './styles.sass';

const CartItem = ({ item, onUpdateCart, onRemoveFromCart }) => {

    const oneItem = () => {
        if (item.quantity == 1)
        {
            onRemoveFromCart(item.id);
        }
    }

    const itemPriceTotal = (itemPrice, itemQuantity) => {
        {
            return itemPrice * itemQuantity;
        }
    }

        return (
            <Card className="root">
                <CardMedia image={item.attributes.image} alt={item.name} className="media"/>
                <CardContent className="cardCartContent">
                    <Typography className="productCardName">
                        {item.name}
                    </Typography>
                    <Typography className="productCardPrice" gutterBottom>
                        {itemPriceTotal(item.price, item.quantity)}.00
                    </Typography>
                    <Typography className="productCardCategory" variant="body2">
                        {item.attributes.category_name}
                    </Typography>
                </CardContent>
                <CardActions className="cardCartActions">
                    <div className="buttons">
                        <Button type="button" size="small" onClick={() => {
                            onUpdateCart(item.id, -1);
                            oneItem()
                        }}>-</Button>
                        <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
                        <Button type="button" size="small" onClick={() => onUpdateCart(item.id, 1)}>+</Button>
                    </div>
                    <Button className="removeButton" variant="contained" type="button"
                            onClick={() => onRemoveFromCart(item.id)}>Удалить</Button>
                </CardActions>
            </Card>
        );
    };

export default CartItem;
