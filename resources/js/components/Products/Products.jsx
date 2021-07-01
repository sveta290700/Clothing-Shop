import React, {useState} from 'react';
import { Grid, Slider, Typography, List, ListItem, ListItemText, ListItemIcon, Checkbox, FormControlLabel, Radio, RadioGroup, Button } from '@material-ui/core/';
import { Pagination } from '@material-ui/lab';
import SearchBar from "material-ui-search-bar";

import Product from './Product/Product';

import './styles.sass';

const Products = ({ products, categories, onAddToCart, totalProducts, productsPerPage, openPage, paginate, filterByCategory, sortProducts }) => {

    function valuetext(value) {
        return `${value}`;
    }

    const [sliderValue, setSliderValue] = useState([2400, 6000]);

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
    };

    const dropPriceFilters = () => {
        setSliderValue([2400, 6000]);
    };

    const [radioValue, setRadioValue] = useState('empty');

    const handleRadioChange = (event) => {
        switch (event.target.value) {
            case 'descPrice': {
                sortProducts(true, true, false);
                break;
            }
            case 'ascPrice': {
                sortProducts(false, true, false);
                break;
            }
            case 'descName': {
                sortProducts(true, false, true);
                break;
            }
            case 'ascName': {
                sortProducts(false, false, true);
                break;
            }
            default:
                break;
        }
        setRadioValue(event.target.value);
    };

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

        filterByCategory(newChecked, radioValue);
        setChecked(newChecked);
    };

    const dropSorts = () => {
        filterByCategory(checked, 'empty');
        setRadioValue('empty');
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
                            Фильтр по категории
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
                    <div className="sortersSearchPriceFilter">
                        <div className="searchBarDiv">
                            <Typography className="searchLabel" variant="h6">
                                Поиск
                            </Typography>
                        <SearchBar className="searchBar" placeholder="Наименование продукта"
                            onChange={() => console.log('onChange')}
                            onCancelSearch={() => console.log('onCancelSearch')}
                            onRequestSearch={() => console.log('onRequestSearch')} />
                        </div>
                        <div className="sorters">
                            <Typography className="sortersLabel" variant="h6">
                                Сортировка
                            </Typography>
                            <RadioGroup name="sorts" value={radioValue} onChange={handleRadioChange}>
                                <FormControlLabel value="descPrice" control={<Radio size="small"/>} label="▼ Цена"/>
                                <FormControlLabel value="ascPrice" control={<Radio size="small"/>} label="▲ Цена"/>
                                <FormControlLabel value="descName" control={<Radio size="small"/>} label="▼ Наименование"/>
                                <FormControlLabel value="ascName" control={<Radio size="small"/>} label="▲ Наименование"/>
                            </RadioGroup>
                            <Button className="dropSortsButton" type="button" variant="contained" onClick={() => dropSorts()}>Сброс сортировок</Button>
                        </div>
                        <div className="priceFilter">
                            <Typography className="priceFilterLabel" variant="h6">
                                Фильтр по цене
                            </Typography>
                            <Slider className="priceSlider"
                                    min={500}
                                    max={8000}
                                    step={100}
                                    value={sliderValue}
                                    onChange={handleSliderChange}
                                    valueLabelDisplay="on"
                                    aria-labelledby="range-slider"
                                    getAriaValueText={valuetext} />
                            <div className="priceFilterButtons">
                            <Button className="applyPriceFiltersButton" type="button" variant="contained">Применить</Button>
                            <Button className="dropPriceFiltersButton" type="button" variant="contained" onClick={() => dropPriceFilters()}>Сброс</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Grid className="items" container spacing={1}>
                    {products.map((product) => (
                        <Grid item key={product.id} xs={8} sm={7} md={6} lg={3}>
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
