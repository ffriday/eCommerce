import { useState } from 'react';
import InputForm, { IInputAutocomplete, IInputForm } from '../inputForm/inputForm';
import SliderButton from '../sliderButton/sliderButton';
import './registerForm.scss';

const RegisterForm = () => {
  const [firstPage, setFirstPage] = useState(true);

  const sliderHandler = () => {
    setFirstPage(!firstPage);
  };

  const validateEmail = (str: string) => str; //placeholder

  const emailFormProps: IInputForm = {
    name: 'email',
    type: 'email',
    id: 'email',
    placeholder: 'Ваш e-mail',
    inputClassName: 'register__input-email',
    labelClassName: 'register__label-email',
    propLabelInfo: 'email',
  };

  const countryAutocomplete: IInputAutocomplete = {
    listName: 'country',
    dataList: ['Belarus', 'Russia', 'Turkey'],
  };

  const countryFormProps: IInputForm = {
    name: 'country',
    type: 'text',
    id: 'countrySelect',
    placeholder: 'Страна',
    inputClassName: 'register__input-country',
    labelClassName: 'register__label-country',
    propLabelInfo: 'Country',
    autocomplete: countryAutocomplete,
  };

  return (
    <div className='register'>
      <form className='register__form'>
        <h1 className='register__headinf'>Регистрация</h1>
        <p className='register__subtitle'>Создайте аккаунт, чтобы войти в личный кабинет</p>
        <SliderButton text={{ first: 'Шаг 1', second: 'Шаг 2' }} handler={sliderHandler} />
        <InputForm {...emailFormProps} />
        <InputForm {...countryFormProps} />
      </form>
    </div>
  );
};

export default RegisterForm;
