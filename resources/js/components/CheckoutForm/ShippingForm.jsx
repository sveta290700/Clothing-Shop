import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import './styles.sass';

const ShippingForm = ({ next }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        next({ ...data });
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h6" className="formTitle">Личные данные</Typography>
                <label className="inputLabel">Фамилия</label>
                <input
                    placeholder="Фамилия"
                    {...register("lastName", {
                        required: true,
                        pattern: /^[А-Я][а-я]+$/
                    })}
                />
                {errors?.lastName?.type === "required" && <p>⚠ Заполните поле "Фамилия"</p>}
                {errors?.lastName?.type === "pattern" && <p>⚠ Некорректный формат данных в поле "Фамилия"</p>}
                <label className="inputLabel">Имя</label>
                <input
                    placeholder="Имя"
                    {...register("firstName", {
                        required: true,
                        pattern: /^[А-Я][а-я]+$/
                    })}
                />
                {errors?.firstName?.type === "required" && <p>⚠ Заполните поле "Имя"</p>}
                {errors?.firstName?.type === "pattern" && <p>⚠ Некорректный формат данных в поле "Имя"</p>}
                <label className="inputLabel">Отчество</label>
                <input
                    placeholder="Отчество"
                    {...register("patronym", {
                        pattern: /^[А-Я][а-я]+$/
                    })}
                />
                {errors?.patronym?.type === "pattern" && <p>⚠ Некорректный формат данных в поле "Отчество"</p>}
                <label className="inputLabel">Номер телефона</label>
                <input
                    placeholder="Номер телефона"
                    {...register("telephoneNumber", {
                        required: true,
                        pattern: /^((\+7|7|8)+([0-9]){10})$/
                    })}
                />
                {errors?.telephoneNumber?.type === "required" && <p>⚠ Заполните поле "Номер телефона"</p>}
                {errors?.telephoneNumber?.type === "pattern" && <p>⚠ Некорректный формат данных в поле "Номер телефона"</p>}
                <label className="inputLabel">Номер телефона</label>
                <input
                    placeholder="E-mail"
                    {...register("email", {
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    })}
                />
                {errors?.email?.type === "required" && <p>⚠ Заполните поле "E-mail"</p>}
                {errors?.email?.type === "pattern" && <p>⚠ Некорректный формат данных в поле "E-mail"</p>}
                <Typography variant="h6" className="formTitle">Доставка</Typography>
                <label className="inputLabel">Город</label>
                <input
                    placeholder="Город"
                    {...register("city", {
                        required: true,
                        pattern: /^[А-Я][а-яА-Я]+(?:[\s-][а-яА-Я]+){0,2}$/
                    })}
                />
                {errors?.city?.type === "required" && <p>⚠ Заполните поле "Город"</p>}
                {errors?.city?.type === "pattern" && <p>⚠ Некорректный формат данных в поле "Город"</p>}
                <label className="inputLabel">Улица</label>
                <input
                    placeholder="Улица"
                    {...register("street", {
                        required: true,
                        pattern: /^[А-Яа-я0-9\.\-\s]+$/
                    })}
                />
                {errors?.street?.type === "required" && <p>⚠ Заполните поле "Улица"</p>}
                {errors?.street?.type === "pattern" && <p>⚠ Некорректный формат данных в поле "Улица"</p>}
                <label className="inputLabel">Дом</label>
                <input
                    placeholder="Дом"
                    {...register("house", {
                        required: true,
                        pattern: /^[1-9][0-9]*[а-я]*/
                    })}
                />
                {errors?.house?.type === "required" && <p>⚠ Заполните поле "Дом"</p>}
                {errors?.house?.type === "pattern" && <p>⚠ Некорректный формат данных в поле "Дом"</p>}
                <label className="inputLabel">Квартира</label>
                <input
                    placeholder="Квартира"
                    {...register("flat", {
                        pattern: /^[1-9][0-9]*$/
                    })}
                />
                {errors?.flat?.type === "pattern" && <p>⚠ Некорректный формат данных в поле "Квартира"</p>}
                <Typography variant="h6" className="formTitle">Комментарий к заказу</Typography>
                <input
                    placeholder="Комментарий"
                    {...register("comment")}
                />
                <div className="buttons">
                    <Button className="toCartButton" component={Link} variant="outlined" to="/cart">К корзине</Button>
                    <Button className="nextButton" type="submit" variant="outlined">Далее</Button>
                </div>
            </form>
        </>
    );
};

export default ShippingForm;
