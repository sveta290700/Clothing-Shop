import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';

import FormInput from './CustomTextField';

import './styles.sass';

const ShippingForm = ({ next }) => {

    const methods = useForm();

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next({ ...data }))}>
                    <Typography variant="h6" className="formTitle">Личные данные</Typography>
                    <Grid container item xs={12} spacing={2} className="formGrid">
                        <FormInput required name='lastName' label='Фамилия' />
                        <FormInput required name='firstName' label='Имя' />
                        <FormInput name='patronym' label='Отчество' />
                        <FormInput required name='telephoneNumber' label='Номер телефона' />
                        <FormInput required name='email' label='E-mail' />
                    </Grid>
                    <Typography variant="h6" className="formTitle">Доставка</Typography >
                    <Grid container item xs={12} spacing={2} className="formGrid">
                        <FormInput required name='city' label='Город' />
                        <FormInput required name='street' label='Улица' />
                        <FormInput required name='house' label='Дом' />
                        <FormInput name='flat' label='Квартира' />
                    </Grid>
                    <Typography variant="h6" className="formTitle">Комментарий к заказу</Typography>
                    <div className="orderComment">
                        <FormInput name='comment' label='Комментарий'/>
                    </div>
                    <div className="buttons">
                        <Button className="toCartButton" component={Link} variant="outlined" to="/cart">К корзине</Button>
                        <Button className="nextButton" type="submit" variant="outlined">Далее</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};

export default ShippingForm;
