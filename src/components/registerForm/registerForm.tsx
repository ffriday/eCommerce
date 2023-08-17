import { Context, createContext, useContext, useState } from 'react';
import InputForm, { IInputAutocomplete, IInputForm } from '../inputForm/inputForm';
import SliderButton from '../sliderButton/sliderButton';
import './registerForm.scss';
import Checkbox from '../checkbox/checkbox';
import SubmitButton from '../submitButton/submitButton';

interface IValidate {
  email: boolean;
  password: boolean;
  name: boolean;
  surename: boolean;
  birthDate: boolean;
  shipCountry: boolean;
  billCountry: boolean;
}

const RegisterForm = () => {
  const [validate, setValidate] = useState();
  const [firstPage, setFirstPage] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const RegisterContext = createContext({ validate, setValidate });

  const sliderHandler = () => {
    setFirstPage(!firstPage);
  };

  return (
    <RegisterContext.Provider value={{ validate, setValidate }}>
      <div className='register'>
        <form className='register__form'>
          <h1 className='register__heading'>Регистрация</h1>
          <p className='register__subtitle'>Создайте аккаунт, чтобы войти в личный кабинет</p>
          <SliderButton text={{ first: 'Шаг 1', second: 'Шаг 2' }} handler={sliderHandler} firstStep={firstPage} className='register__slider' />
          {firstPage ? <RegisterStep1 /> : null}
          {!firstPage ? <RegisterStep2 /> : null}
          <SubmitButton text='Зарегистрироваться' disabled={submitDisabled} className='register__submit' />
          <span className='register__loginLink'>
            У вас уже есть аккаунт? <a href='\login'>Войти</a>
          </span>
        </form>
      </div>
    </RegisterContext.Provider>
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
      <InputForm {...firstNameFormProps} />
      <InputForm {...lastNameFormProps} />
      <InputForm {...emailFormProps} />
      <InputForm {...passwordFormProps} />
      <InputForm {...passwordCheckFormProps} />
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
    placeholder: 'Выберите страну',
    inputClassName: 'register__input-country',
    labelClassName: 'register__label-country',
    propLabelInfo: 'Страна',
    autocomplete: countryAutocomplete,
  };

  const buildingFormProps: IInputForm = {
    name: 'building',
    type: 'text',
    id: 'building',
    placeholder: 'Дом',
    inputClassName: 'register__input-building',
    labelClassName: 'register__label-building',
    propLabelInfo: 'Дом',
  };

  const apartFormProps: IInputForm = {
    name: 'apart',
    type: 'text',
    id: 'apart',
    placeholder: 'Квартира',
    inputClassName: 'register__input-apart',
    labelClassName: 'register__label-apart',
    propLabelInfo: 'Квартира',
  };

  return (
    <section className='register__step2'>
      <div className=''>
        <InputForm {...countryFormProps} />
        <InputForm {...cityFormProps} />
        <InputForm {...streetFormProps} />
        <div className='register__home'>
          <InputForm {...buildingFormProps} />
          <InputForm {...apartFormProps} />
        </div>
        <InputForm {...postalFormProps} />
      </div>
      <div>
        <InputForm {...countryFormProps} />
        <InputForm {...cityFormProps} />
        <InputForm {...streetFormProps} />
        <div className='register__home'>
          <InputForm {...buildingFormProps} />
          <InputForm {...apartFormProps} />
        </div>
        <InputForm {...postalFormProps} />
      </div>
      <Checkbox id='checkbox' handler={() => 'test action'} classNameWrapper='register__checkbox' title='Same adress' />
    </section>
  );
};

export default RegisterForm;
