import React from 'react';
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from '@material-ui/core';

import './styles.sass';

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {

    return (
        <Card className="cart-item">
            <CardMedia image={item.media.source} alt={item.name} className="media" />
            <CardContent className="cardCartContent">
                <Typography variant="h5">{item.name}</Typography>
                <Typography variant="h5">{item.line_total.formatted_with_symbol}</Typography>
            </CardContent>
            <CardActions className="cardCartActions">
                <div className="buttons">
                    <Button type="button" size="small" onClick={() => onUpdateCartQty(item.id, item.quantity - 1)}>-</Button>
                    <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
                    <Button type="button" size="small" onClick={() => onUpdateCartQty(item.id, item.quantity + 1)}>+</Button>
                </div>
                <Button className="removeButton" variant="contained" type="button" onClick={() => onRemoveFromCart(item.id)}>Удалить</Button>
            </CardActions>
        </Card>
    );
};

export default CartItem;
