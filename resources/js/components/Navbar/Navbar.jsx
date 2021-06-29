import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import logo from '../../assets/logo.png';

import './styles.sass';

const Navbar = ({ totalItems }) => {

    const location = useLocation();

    return (
        <>
            <AppBar position="fixed" className="appBar">
                <Toolbar>
                    <Typography component={Link} to="/" variant="h6" className="title">
                        <img src={logo} alt="commerce.js" className="image" />
                        Магазин одежды
                    </Typography>
                    {location.pathname !== '/cart' && (
                        <div className="button">
                            <IconButton component={Link} to="/cart" className="cartIcon">
                                <Badge className="badge" badgeContent={totalItems}>
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Navbar;
