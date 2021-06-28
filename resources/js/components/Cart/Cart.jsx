import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import CartItem from './CartItem/CartItem'

import './styles.sass';

const Cart = ({ cart, handleUpdateCartQty, handleRemoveFromCart }) => {

    const EmptyCart = () => (
        <Typography variant="subtitle1">Ваша корзина пуста,&nbsp;
            <Link className="link" to="/">начните покупки</Link>!
        </Typography>
    );

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={3} key={item.id}>
                        <CartItem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} />
                    </Grid>
                ))}
            </Grid>
            <div className="cartDetails">
                <Typography variant="h4">Сумма: {cart.subtotal.formatted_with_symbol}</Typography>
                <div>
                    <Button className="backButton" component={Link} to="/" size="large" type="button" variant="contained">Назад</Button>
                    <Button className="checkoutButton" component={Link} to="/checkout" size="large" type="button" variant="contained">Оформить заказ</Button>
                </div>
            </div>
        </>
    );

    if (!cart.line_items) return 'Loading...';

    return (
        <Container>
            <Typography className="cartTitle" variant="h3">
                Корзина
            </Typography>
            { !cart.line_items.length ? <EmptyCart /> : <FilledCart />}
        </Container>
    );
};

export default Cart;
