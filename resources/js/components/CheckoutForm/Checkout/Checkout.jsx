import React, {useEffect, useState} from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, } from '@material-ui/core';

import ShippingForm from '../ShippingForm';
import ConfirmationForm from '../ConfirmationForm';

import './styles.sass';

const steps = ['Ввод данных', 'Подтверждение заказа'];

const Checkout = ({ cart, cartList, onCaptureCheckout, refreshProducts }) => {

    const [activeStep, setActiveStep] = useState(0);
    const [shippingData, setShippingData] = useState({});

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const next = (data) => {
        setShippingData(data);
        nextStep();
    };

    const ConfirmedOrder = () => (
        <Typography variant="h6" className="formTitle">
            Спасибо за покупку, {shippingData.lastName} {shippingData.firstName}! :)
            <br />
            На Вашу почту было направлено сообщение о подтверждении заказа.
        </Typography>
    )

    const Form = () => (activeStep === 0
        ? <ShippingForm nextStep={nextStep} setShippingData={setShippingData} next={next}/>
        : <ConfirmationForm cart={cart} cartList={cartList} shippingData={shippingData} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} />);

    useEffect(() => {
        refreshProducts();
    }, []);

    return (
        <>
            <main className="layout">
                <Paper className="paper">
                    <Typography className="checkoutLabel" variant="h4">Оформление заказа</Typography>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <ConfirmedOrder /> : <Form />}
                </Paper>
            </main>
        </>
    );
};

export default Checkout;
