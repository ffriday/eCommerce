import { createContext, useContext, useEffect, useState } from 'react';
import InputForm from '../inputForm/inputForm';
import SliderButton from '../sliderButton/sliderButton';
import './registerForm.scss';
import Checkbox from '../checkbox/checkbox';
import SubmitButton from '../submitButton/submitButton';
import { EmailErrors, PasswordErrors, RegiserInputNames } from '../../constants/types';
import {
  apartFormProps,
  buildingFormProps,
  cityFormProps,
  countryFormProps,
  dateFormProps,
  emailFormProps,
  emailPattern,
  firstNameFormProps,
  lastNameFormProps,
  namePattern,
  passwordCheckFormProps,
  passwordFormProps,
  passwordPattern,
  postalFormProps,
  streetFormProps,
} from './formProps';

interface IValueStatus {
  val: string;
  err: string;
  className?: string;
}

interface IAddress {
  country: IValueStatus;
  city: IValueStatus;
  street: IValueStatus;
  postal: IValueStatus;
  building: IValueStatus;
  apart: IValueStatus;
}

interface IValidate {
  email: IValueStatus;
  password: IValueStatus;
  passwordCheck: IValueStatus;
  name: IValueStatus;
  surename: IValueStatus;
  birthDate: IValueStatus;
  shipment: IAddress;
  bill: IAddress;
}

export interface IPattern {
  pattern: RegExp;
  error: string | EmailErrors | PasswordErrors;
}

interface IRegisterContext {
  validateArr: Partial<IValidate>;
  setValidateArr: React.Dispatch<React.SetStateAction<Partial<IValidate>>>;
}

const checkInput = (value: string, pattern: IPattern[]): IValueStatus => {
  const errorArr = pattern.filter((elem) => !elem.pattern.test(value));
  const error = errorArr.length && value ? errorArr[0].error : '';
  return { val: value, err: error };
};

const handleInput = (event: React.FormEvent<HTMLInputElement>, context: IRegisterContext, pattern: IPattern[], key: string) => {
  const status = checkInput(event.currentTarget.value, pattern);
  const labelClass = status.err.length ? ' invailid-label' : ' vailid-label';
  status.className = emailFormProps.labelClassName + labelClass;
  context.setValidateArr({ ...context.validateArr, [key]: status });
};

const checkMatchPassword = (event: React.FormEvent<HTMLInputElement>, context: IRegisterContext) => {
  const status: IValueStatus = { val: event.currentTarget.value, err: PasswordErrors.notMatch };
  if (status.val && status.val !== context.validateArr.password?.val) {
    status.className = 'invailid-label';
  } else {
    status.className = 'vailid-label';
    status.err = '';
  }
  context.setValidateArr({ ...context.validateArr, passwordCheck: status });
};

const RegisterContext = createContext<IRegisterContext | null>(null);

const RegisterForm = () => {
  const validationState: Partial<IValidate> = {};

  const [validateArr, setValidateArr] = useState(validationState);
  const [firstPage, setFirstPage] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const sliderHandler = () => {
    setFirstPage(!firstPage);
  };

  const canSubmit = (state: Partial<IValidate> | Partial<IAddress>): boolean => {
    return Object.values(state).reduce((acc, value) => {
      if ('val' in value) {
        // If error (in runtime enum value is string too) is not empty or value empty => we have error and we can't submit
        if (value.err || !value.val) acc = acc && false;
      } else {
        // If it is a IAdress object
        acc = canSubmit(value);
      }
      return acc;
    }, true);
  };

  const updateForm = useEffect(() => {
    setSubmitDisabled(!canSubmit(validationState));
  }, [validateArr]);

  return (
    <RegisterContext.Provider value={{ validateArr, setValidateArr } as IRegisterContext}>
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
  const context = useContext(RegisterContext) as IRegisterContext;

  return (
    <section className='register__step2'>
      <InputForm
        {...firstNameFormProps}
        labelClassName={`${firstNameFormProps.labelClassName} ${context.validateArr.name?.className || ''}`}
        propLabelInfo={context.validateArr.name?.err}
        handler={(event) => handleInput(event, context, namePattern, RegiserInputNames.name)}
      />
      <InputForm
        {...lastNameFormProps}
        labelClassName={`${lastNameFormProps.labelClassName} ${context.validateArr.surename?.className || ''}`}
        propLabelInfo={context.validateArr.surename?.err}
        handler={(event) => handleInput(event, context, namePattern, RegiserInputNames.surename)}
      />
      <InputForm
        {...emailFormProps}
        labelClassName={`${emailFormProps.labelClassName} ${context.validateArr.email?.className || ''}`}
        propLabelInfo={context.validateArr.email?.err}
        handler={(event) => handleInput(event, context, emailPattern, RegiserInputNames.email)}
      />
      <InputForm
        {...passwordFormProps}
        labelClassName={`${passwordFormProps.labelClassName} ${context.validateArr.password?.className || ''}`}
        propLabelInfo={context.validateArr.password?.err}
        handler={(event) => handleInput(event, context, passwordPattern, RegiserInputNames.password)}
      />
      <InputForm
        {...passwordCheckFormProps}
        labelClassName={`${passwordCheckFormProps.labelClassName} ${context.validateArr.passwordCheck?.className || ''}`}
        propLabelInfo={context.validateArr.passwordCheck?.err}
        handler={(event) => checkMatchPassword(event, context)}
      />
      <InputForm {...dateFormProps} />
    </section>
  );
};

const RegisterStep2 = () => {
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
