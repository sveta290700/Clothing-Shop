import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import emailjs from "emailjs-com";

import './styles.sass';

const ConfirmationForm = ({ cart, cartList, shippingData, backStep, onCaptureCheckout, nextStep }) => {

    const [checked, setChecked] = React.useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        emailjs.sendForm('service_lna5dwq', 'template_67w7h3n', event.target, 'user_wkvrIcMqi9w7HLHH1X9w1')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
           });
        checkoutOrder();
    };

    const checkoutOrder = () => {
        const orderData = {
            fio: shippingData.lastName + " " + shippingData.firstName + " " +  shippingData.patronym,
            phone_number: shippingData.telephoneNumber,
            email: shippingData.email,
            address: shippingData.city + ", " +  shippingData.street + " " +  shippingData.house + " " +  shippingData.flat,
            cost: cart.total_amount,
            comments: shippingData.comment
        }
        onCaptureCheckout(orderData);
        nextStep();
    };

    return (
        <>
            <Typography variant="h6" className="formTitle">Ваш заказ</Typography>
            <List disablePadding>
                {cartList.map((product) => (
                    <ListItem className="listItem" key={product.name}>
                        <ListItemText primary={product.name} secondary={`Количество: ${product.quantity}`}/>
                        <Typography variant="body2">
                            {product.price}.00
                        </Typography>
                    </ListItem>
                ))}
                <ListItem className="listItem">
                    <ListItemText primary="Итоговая стоимость заказа"/>
                    <Typography className="totalOrderPrice" variant="subtitle1">
                        {cart.total_amount}.00
                    </Typography>
                </ListItem>
            </List>
            <Divider/>
            <Typography variant="h6" className="formTitle">Подтверждение заказа</Typography>
            <div className="orderConfirmation">
                <FormControlLabel
                    onChange={handleChange}
                    control={<Checkbox/>}
                    label="Соглашаюсь на обработку данных"
                    labelPlacement="end"/>
                <div className="buttons">
                    <Button className="backToShippingFormButton" type="button" variant="outlined" onClick={backStep}>Назад</Button>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <input type="hidden" name="lastName" value={shippingData.lastName}/>
                        <input type="hidden" name="firstName" value={shippingData.firstName}/>
                        <input type="hidden" name="patronym" value={shippingData.patronym}/>
                        <input type="hidden" name="email" value={shippingData.email}/>
                        <input type="hidden" name="telephoneNumber" value={shippingData.telephoneNumber}/>
                        <input type="hidden" name="city" value={shippingData.city}/>
                        <input type="hidden" name="street" value={shippingData.street}/>
                        <input type="hidden" name="house" value={shippingData.house}/>
                        <input type="hidden" name="flat" value={shippingData.flat}/>
                        <input type="hidden" name="comment" value={shippingData.comment}/>
                        <Button className="submitOrder" type="submit" disabled={!checked} variant="outlined">
                            Оформить заказ
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ConfirmationForm;
