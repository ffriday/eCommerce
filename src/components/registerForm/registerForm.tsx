import { useState } from 'react';
import InputForm, { IInputAutocomplete, IInputForm } from '../inputForm/inputForm';
import SliderButton from '../sliderButton/sliderButton';
import './registerForm.scss';
import Checkbox from '../checkbox/checkbox';

const RegisterForm = () => {
  const [firstPage, setFirstPage] = useState(true);

  const sliderHandler = () => {
    console.log('render');
    setFirstPage(!firstPage);
  };

  return (
    <div className='register'>
      <form className='register__form'>
        <h1 className='register__headinf'>Регистрация</h1>
        <p className='register__subtitle'>Создайте аккаунт, чтобы войти в личный кабинет</p>
        <SliderButton text={{ first: 'Шаг 1', second: 'Шаг 2' }} handler={sliderHandler} />
        {firstPage ? <RegisterStep1 /> : null}
        {!firstPage ? <RegisterStep2 /> : null}
      </form>
    </div>
  );
};

const RegisterStep1 = () => {
  const emailFormProps: IInputForm = {
    name: 'email',
    type: 'email',
    id: 'email',
    placeholder: 'Ваш e-mail',
    inputClassName: 'register__input-email',
    labelClassName: 'register__label-email',
    propLabelInfo: 'email',
  };

  const passwordFormProps: IInputForm = {
    name: 'password',
    type: 'password',
    id: 'password',
    placeholder: 'Придумайте пароль',
    inputClassName: 'register__input-password',
    labelClassName: 'register__label-password',
    propLabelInfo: 'Пароль',
  };

  const passwordCheckFormProps: IInputForm = {
    name: 'password-check',
    type: 'password-check',
    id: 'password-check',
    placeholder: 'Повторите пароль',
    inputClassName: 'register__input-password-check',
    labelClassName: 'register__label-password-check',
    propLabelInfo: 'Пароль',
  };

  const firstNameFormProps: IInputForm = {
    name: 'first-name',
    type: 'text',
    id: 'first-name',
    placeholder: 'Имя',
    inputClassName: 'register__input-first-name',
    labelClassName: 'register__label-first-name',
    propLabelInfo: 'Имя',
  };

  const lastNameFormProps: IInputForm = {
    name: 'last-name',
    type: 'text',
    id: 'last-name',
    placeholder: 'Фамилия',
    inputClassName: 'register__input-last-name',
    labelClassName: 'register__label-last-name',
    propLabelInfo: 'Фамилия',
  };

  const dateFormProps: IInputForm = {
    name: 'date',
    type: 'date',
    id: 'date',
    placeholder: 'Дата рождения',
    inputClassName: 'register__input-date',
    labelClassName: 'register__label-date',
    propLabelInfo: 'Дата рождения',
  };

  return (
    <section className='register__step2'>
      <InputForm {...emailFormProps} />
      <InputForm {...passwordFormProps} />
      <InputForm {...passwordCheckFormProps} />
      <InputForm {...firstNameFormProps} />
      <InputForm {...lastNameFormProps} />
      <InputForm {...dateFormProps} />
    </section>
  );
};

const RegisterStep2 = () => {
  const streetFormProps: IInputForm = {
    name: 'street',
    type: 'text',
    id: 'street',
    placeholder: 'Улица',
    inputClassName: 'register__input-street',
    labelClassName: 'register__label-street',
    propLabelInfo: 'Улица',
  };

  const cityFormProps: IInputForm = {
    name: 'city',
    type: 'text',
    id: 'city',
    placeholder: 'Город',
    inputClassName: 'register__input-city',
    labelClassName: 'register__label-city',
    propLabelInfo: 'Город',
  };

  const postalFormProps: IInputForm = {
    name: 'postal',
    type: 'text',
    id: 'postal',
    placeholder: 'Почтовый индекс',
    inputClassName: 'register__input-postal',
    labelClassName: 'register__label-postal',
    propLabelInfo: 'Почтовый индекс',
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
    propLabelInfo: 'Страна',
    autocomplete: countryAutocomplete,
  };

  return (
    <section className='register__step2'>
      <div className=''>
        <InputForm {...streetFormProps} />
        <InputForm {...cityFormProps} />
        <InputForm {...postalFormProps} />
        <InputForm {...countryFormProps} />
      </div>
      <div>
        <InputForm {...streetFormProps} />
        <InputForm {...cityFormProps} />
        <InputForm {...postalFormProps} />
        <InputForm {...countryFormProps} />
      </div>
      <Checkbox id='checkbox' handler={() => 'test action'} classNameWrapper='register__checkbox' title='Same adress' />
    </section>
  );
};

export default RegisterForm;
