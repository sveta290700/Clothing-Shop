import React, { useState } from 'react';
import { Grid, Slider, Typography, List, ListItem, ListItemText, ListItemIcon, Checkbox } from '@material-ui/core/';
import { Pagination } from '@material-ui/lab';

import Product from './Product/Product';

import './styles.sass';

function valuetext(value) {
    return `${value}`;
}

const Products = ({ products, categories, onAddToCart }) => {

    const [value, setValue] = useState([1500, 3000]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <main>
            <div className="content">
                <div className="toolbar" />
                <div className="filters">
                    <div className="categoryFilter">
                        <Typography className="categoryFilterLabel" variant="h6">
                            Фильтр по категории:
                        </Typography>
                        <List component="nav" aria-label="main mailbox folders">
                            {categories.map((category) => (
                                <ListItem key={category.name} className="categoryLabel">
                                    <ListItemIcon>
                                        <Checkbox className="checkbox"
                                                  edge="start"
                                                  checked={false}
                                                  tabIndex={-1}
                                                  disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={category.name} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div className="priceFilter">
                        <Typography className="priceFilterLabel" variant="h6">
                            Фильтр по цене:
                        </Typography>
                        <Slider className="priceSlider"
                                min={0}
                                max={5000}
                                step={100}
                                value={value}
                                onChange={handleChange}
                                valueLabelDisplay="on"
                                aria-labelledby="range-slider"
                                getAriaValueText={valuetext} />
                    </div>
                </div>
                <Grid className="items" container spacing={4}>
                    {products.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                            <Product product={product} onAddToCart={onAddToCart} />
                        </Grid>
                    ))}
                </Grid>
            </div>
            <Pagination size="large" color="secondary" count={5} />
        </main>
    );
}

export default Products;
