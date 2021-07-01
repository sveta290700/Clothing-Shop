import React from 'react';
import { Grid, Slider, Typography, List, ListItem, ListItemText, ListItemIcon, Checkbox } from '@material-ui/core/';
import { Pagination } from '@material-ui/lab';

import Product from './Product/Product';

import './styles.sass';

const Products = ({ products, categories, onAddToCart, totalProducts, productsPerPage, openPage, paginate, filterByCategory }) => {

    const [checked, setChecked] = React.useState([]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        }
        else {
            newChecked.splice(currentIndex, 1);
        }
        filterByCategory(newChecked);
        setChecked(newChecked);
    };

    const handleChange = (e, p) => {
        paginate(p);
    };

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <main>
            <div className="content">
                <div className="filters">
                    <div className="categoryFilter">
                        <Typography className="categoryFilterLabel" variant="h6">
                            Фильтр по категории:
                        </Typography>
                        <List>
                            {categories.map((category) => (
                                <ListItem key={category.id} className="categoryLabel">
                                    <ListItemIcon>
                                        <Checkbox className="checkbox"
                                                  edge="start"
                                                  checked={checked.indexOf(category.id) !== -1}
                                                  tabIndex={-1}
                                                  disableRipple
                                                  onChange={handleToggle(category.id)}
                                        />
                                    </ListItemIcon>
                                    <ListItemText className="categoryItemLabel" primary={category.name} disableTypography/>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </div>
                <Grid className="items" container spacing={1}>
                    {products.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                            <Product product={product} onAddToCart={onAddToCart} />
                        </Grid>
                    ))}
                </Grid>
            </div>
            <Pagination size="large" color="secondary" onChange={handleChange} page={openPage} count={pageNumbers.length} />
        </main>
    );
};

export default Products;
