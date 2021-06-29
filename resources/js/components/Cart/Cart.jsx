import React, {useEffect, useState} from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import CartItem from './CartItem/CartItem'

import './styles.sass';

const Cart = ({ cart, cartList, handleUpdateCart, handleRemoveFromCart }) => {

    const EmptyCart = () => (
        <Typography variant="subtitle1">Ваша корзина пуста,&nbsp;
            <Link className="link" to="/">начните покупки</Link>!
        </Typography>
    );

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cartList.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                        <CartItem item={item} onUpdateCart={handleUpdateCart} onRemoveFromCart={handleRemoveFromCart} />
                    </Grid>
                ))}
            </Grid>
            <div className="cartDetails">
                <Typography variant="h4">Сумма: {cart.total_amount}.00</Typography>
                <div>
                    <Button className="backButton" component={Link} to="/" size="large" type="button" variant="contained">Назад</Button>
                    <Button className="checkoutButton" component={Link} to="/checkout" size="large" type="button" variant="contained">Оформить заказ</Button>
                </div>
            </div>
        </>
    );

    if (!cartList) return 'Загрузка...';

    return (
        <Container>
            <Typography className="cartTitle" variant="h3">
                Корзина
            </Typography>
            { !cart.total_quantity ? <EmptyCart /> : <FilledCart />}
        </Container>
    );
};

export default Cart;