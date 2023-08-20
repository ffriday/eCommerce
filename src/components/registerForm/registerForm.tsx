import { FC, createContext, useContext, useEffect, useState } from 'react';
import InputForm from '../inputForm/inputForm';
import SliderButton from '../sliderButton/sliderButton';
import './registerForm.scss';
import Checkbox from '../checkbox/checkbox';
import SubmitButton from '../submitButton/submitButton';
import { AddressErrors, DateErrors, EmailErrors, PasswordErrors, RegiserInputNames } from '../../constants/types';
import {
  apartFormProps,
  buildingFormProps,
  buildingapartPattern,
  cityFormProps,
  cityPattern,
  countryAutocomplete,
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
  postalPattern,
  streetFormProps,
  streetPattern,
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
  validateArr: IValidate;
  setValidateArr: React.Dispatch<React.SetStateAction<Partial<IValidate>>>;
  billAddressDisabled: boolean;
  setBillAddressDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IAddressInput {
  caption: string;
  className: string;
  arrKey: RegiserInputNames.shipment | RegiserInputNames.bill;
  isDisabled?: boolean;
}

const checkInput = (value: string, pattern: IPattern[]): IValueStatus => {
  const errorArr = pattern.filter((elem) => !elem.pattern.test(value));
  const error = errorArr.length ? errorArr[0].error : '';
  return { val: value, err: error };
};

const handleInput = (event: React.FormEvent<HTMLInputElement>, context: IRegisterContext, pattern: IPattern[], key: RegiserInputNames) => {
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

const checkDate = (event: React.FormEvent<HTMLInputElement>, context: IRegisterContext, age: number) => {
  const date = new Date(event.currentTarget.value);
  const status: IValueStatus = { val: event.currentTarget.value, err: DateErrors.tooYang, className: 'invailid-label' };
  if (!isNaN(date.getTime())) {
    const currentDate = new Date();
    const delta = currentDate.getTime() - date.getTime();
    const ageMiliseconds = age * (365 * 24 * 60 * 60 * 1000);
    if (delta >= ageMiliseconds) {
      status.className = 'vailid-label';
      status.err = '';
    }
  }
  context.setValidateArr({ ...context.validateArr, birthDate: status });
};

const RegisterContext = createContext<IRegisterContext | null>(null);

const RegisterForm = () => {
  const emptyValue: IValueStatus = { val: '', err: '', className: '' };
  const emptyAddress: IAddress = {
    country: emptyValue,
    city: emptyValue,
    street: emptyValue,
    postal: emptyValue,
    building: emptyValue,
    apart: emptyValue,
  };
  const validationState: Partial<IValidate> = {
    email: emptyValue,
    password: emptyValue,
    passwordCheck: emptyValue,
    name: emptyValue,
    surename: emptyValue,
    birthDate: emptyValue,
    shipment: emptyAddress,
    bill: emptyAddress,
  };

  const [validateArr, setValidateArr] = useState(validationState);
  const [firstPage, setFirstPage] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [billAddressDisabled, setBillAddressDisabled] = useState(false);

  const sliderHandler = () => {
    setFirstPage(!firstPage);
  };

  const canSubmit = (state: Partial<IValidate> | Partial<IAddress>): boolean => {
    const arr = Object.entries(state);
    let res = false;
    if (arr.length) {
      res = arr.reduce((acc, [key, value]) => {
        if ('val' in value) {
          // If error (in runtime enum value is string too) is not empty or value empty => we have error and we can't submit
          if (value.err || !value.val) acc = acc && false;
        } else {
          // If it is a IAdress object
          if (!billAddressDisabled) {
            acc = canSubmit(value);
          } else {
            if (key !== RegiserInputNames.bill.toString()) acc = canSubmit(value);
          }
        }
        return acc;
      }, true);
    }
    return res;
  };

  useEffect(() => {
    setSubmitDisabled(!canSubmit(validateArr));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateArr, billAddressDisabled]);

  return (
    <RegisterContext.Provider value={{ validateArr, setValidateArr, billAddressDisabled, setBillAddressDisabled } as IRegisterContext}>
      <div className='register'>
        <form className='register__form'>
          <h1 className='register__heading'>Регистрация</h1>
          <p className='register__subtitle'>Создайте аккаунт, чтобы войти в личный кабинет</p>
          <SliderButton text={{ first: 'Шаг 1', second: 'Шаг 2' }} handler={sliderHandler} firstStep={firstPage} className='register__slider' />
          <RegisterStep1 className={!firstPage ? 'register__step-hidden' : ''} />
          <RegisterStep2 className={firstPage ? 'register__step-hidden' : ''} />
          <SubmitButton text='Зарегистрироваться' disabled={submitDisabled} className='register__submit' />
          <span className='register__loginLink'>
            У вас уже есть аккаунт? <a href='\login'>Войти</a>
          </span>
        </form>
      </div>
    </RegisterContext.Provider>
  );
};

const RegisterStep1: FC<{ className: string }> = ({ className }) => {
  const context = useContext(RegisterContext) as IRegisterContext;

  return (
    <section className={`register__step1 ${className}`}>
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
      <InputForm
        {...dateFormProps}
        labelClassName={`${dateFormProps.labelClassName} ${context.validateArr.birthDate?.className || ''}`}
        propLabelInfo={context.validateArr.birthDate?.err}
        handler={(event) => checkDate(event, context, 13)}
      />
    </section>
  );
};

const RegisterStep2: FC<{ className: string }> = ({ className }) => {
  const context = useContext(RegisterContext) as IRegisterContext;

  return (
    <section className={`register__step1 ${className}`}>
      <AddressInputs caption='Адрес для доставки:' className='register__shipment' arrKey={RegiserInputNames.shipment} />
      <AddressInputs
        caption='Адрес для выставления счета:'
        className='register__bill'
        arrKey={RegiserInputNames.bill}
        isDisabled={context.billAddressDisabled}
      />
      <Checkbox
        id='checkbox'
        handler={() => context.setBillAddressDisabled(!context.billAddressDisabled)}
        classNameWrapper='register__checkbox'
        title='Использовать адрес доставки'
      />
    </section>
  );
};

const AddressInputs: FC<IAddressInput> = ({ caption, className, arrKey, isDisabled = false }) => {
  const context = useContext(RegisterContext) as IRegisterContext;

  return (
    <div className={className}>
      <p className='register__addressCaption'>{caption}</p>
      <InputForm
        {...countryFormProps}
        id={`${countryFormProps.id}-${className}`}
        labelClassName={`${countryFormProps.labelClassName} ${context.validateArr.shipment?.country.className || ''}`}
        propLabelInfo={context.validateArr.shipment?.country.err}
        disabled={isDisabled}
        handler={(event) => {
          const error = !countryAutocomplete.dataList.includes(event.currentTarget.value) ? AddressErrors.countryFromList : '';
          const status: IValueStatus = {
            val: event.currentTarget.value,
            err: error,
            className: error.length ? ' invailid-label' : ' vailid-label',
          };
          const adress = { ...context.validateArr[arrKey], country: status };
          context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
        }}
      />
      <InputForm
        {...cityFormProps}
        id={`${cityFormProps.id}-${className}`}
        labelClassName={`${cityFormProps.labelClassName} ${context.validateArr[arrKey].city.className || ''}`}
        propLabelInfo={context.validateArr[arrKey].city.err}
        disabled={isDisabled}
        handler={(event) => {
          const status = checkInput(event.currentTarget.value, cityPattern);
          status.className = status.err.length ? ' invailid-label' : ' vailid-label';
          const adress = { ...context.validateArr[arrKey], city: status };
          context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
        }}
      />
      <InputForm
        {...streetFormProps}
        id={`${streetFormProps.id}-${className}`}
        labelClassName={`${streetFormProps.labelClassName} ${context.validateArr[arrKey].street.className || ''}`}
        propLabelInfo={context.validateArr[arrKey].street.err}
        disabled={isDisabled}
        handler={(event) => {
          const status = checkInput(event.currentTarget.value, streetPattern);
          status.className = status.err.length ? ' invailid-label' : ' vailid-label';
          const adress = { ...context.validateArr[arrKey], street: status };
          context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
        }}
      />
      <div className='register__home'>
        <InputForm
          {...buildingFormProps}
          id={`${buildingFormProps.id}-${className}`}
          labelClassName={`${buildingFormProps.labelClassName} ${context.validateArr[arrKey].building.className || ''}`}
          propLabelInfo={context.validateArr[arrKey].building.err}
          disabled={isDisabled}
          handler={(event) => {
            const status = checkInput(event.currentTarget.value, buildingapartPattern);
            status.className = status.err.length ? ' invailid-label' : ' vailid-label';
            const adress = { ...context.validateArr[arrKey], building: status };
            context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
          }}
        />
        <InputForm
          {...apartFormProps}
          id={`${apartFormProps.id}-${className}`}
          labelClassName={`${apartFormProps.labelClassName} ${context.validateArr[arrKey].apart.className || ''}`}
          propLabelInfo={context.validateArr[arrKey].apart.err}
          disabled={isDisabled}
          handler={(event) => {
            const status = checkInput(event.currentTarget.value, buildingapartPattern);
            status.className = status.err.length ? ' invailid-label' : ' vailid-label';
            const adress = { ...context.validateArr[arrKey], apart: status };
            context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
          }}
        />
      </div>
      <InputForm
        {...postalFormProps}
        id={`${postalFormProps.id}-${className}`}
        labelClassName={`${postalFormProps.labelClassName} ${context.validateArr[arrKey].postal.className || ''}`}
        propLabelInfo={context.validateArr[arrKey].postal.err}
        disabled={isDisabled}
        handler={(event) => {
          const status = checkInput(event.currentTarget.value, postalPattern);
          status.className = status.err.length ? ' invailid-label' : ' vailid-label';
          const adress = { ...context.validateArr[arrKey], postal: status };
          context.setValidateArr({ ...context.validateArr, [arrKey]: adress });
        }}
      />
    </div>
  );
};

export default RegisterForm;
