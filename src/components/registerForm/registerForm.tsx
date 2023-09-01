import { FC, FormEvent, createContext, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import InputForm from '../inputForm/inputForm';
import SliderButton from '../sliderButton/sliderButton';
import './registerForm.scss';
import Checkbox from '../checkbox/checkbox';
import SubmitButton from '../submitButton/submitButton';
import {
  AddressErrors,
  DateErrors,
  EmailErrors,
  HTTPResponseCode,
  IAddress,
  IUserValidate,
  IValueStatus,
  PasswordErrors,
  RegiserInputNames,
  RoutePath,
} from '../../constants/types';
import {
  apartFormProps,
  buildingFormProps,
  buildingapartPattern,
  cityFormProps,
  cityPattern,
  countryAutocomplete,
  countryFormProps,
  countryMAP,
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
import { ErorMap, createCustomer } from '../../constants/register-user';
import { ClientResponse, CustomerSignInResult, ErrorResponse } from '@commercetools/platform-sdk';
import { apiContext } from '../App';

export interface IPattern {
  pattern: RegExp;
  error: string | EmailErrors | PasswordErrors;
}

interface IRegisterContext {
  validateArr: IUserValidate<IValueStatus>;
  setValidateArr: React.Dispatch<React.SetStateAction<Partial<IUserValidate<IValueStatus>>>>;
  billAddressDisabled: boolean;
  setBillAddressDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  defaultShipping: boolean;
  setDefaultShipping: React.Dispatch<React.SetStateAction<boolean>>;
  defaultBill: boolean;
  setDefaultBill: React.Dispatch<React.SetStateAction<boolean>>;
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
  const passwordCheckParams: IValueStatus = { ...context.validateArr.passwordCheck };
  status.className = emailFormProps.labelClassName + labelClass;
  if (key === RegiserInputNames.password && context.validateArr.passwordCheck.val !== event.currentTarget.value) {
    passwordCheckParams.className = 'invailid-label';
    passwordCheckParams.err = PasswordErrors.notMatch;
  }
  context.setValidateArr({ ...context.validateArr, [key]: status, passwordCheck: passwordCheckParams });
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

  const birthDate = moment(event.currentTarget.value, 'YYYY-MM-DD');
  const status: IValueStatus = { val: event.currentTarget.value, err: DateErrors.tooYang, className: 'invailid-label' };
  if (!isNaN(date.getTime())) {
    const currentDate = moment();
    const delta = currentDate.diff(birthDate, 'year');
    if (delta >= age) {
      status.className = 'vailid-label';
      status.err = '';
    }
  }
  context.setValidateArr({ ...context.validateArr, birthDate: status });
};

const RegisterContext = createContext<IRegisterContext | null>(null);

const RegisterForm = () => {
  const emptyValue: IValueStatus = { val: '', err: '', className: '' };
  const emptyAddress: IAddress<IValueStatus> = {
    country: emptyValue,
    city: emptyValue,
    street: emptyValue,
    postal: emptyValue,
    building: emptyValue,
    apart: emptyValue,
  };
  const validationState: IUserValidate<IValueStatus> = {
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
  const [defaultShipping, setDefaultShipping] = useState(false);
  const [defaultBill, setDefaultBill] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const sliderHandler = () => {
    setFirstPage(!firstPage);
  };

  const api = useContext(apiContext);

  const canSubmit = (state: Partial<IUserValidate<IValueStatus>> | Partial<IAddress<IValueStatus>>): boolean => {
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

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitData = validateArr;
    if (billAddressDisabled) {
      submitData.bill = submitData.shipment;
    }

    let response: ClientResponse<CustomerSignInResult> | null = null;
    try {
      const customer = createCustomer(validateArr, defaultShipping, defaultBill, billAddressDisabled);
      response = await api.registerCusomer(customer);
      if (response.statusCode === HTTPResponseCode.registerd) {
        const res = await api.loginCustomer(validateArr.email.val, validateArr.password.val);
        if (res.statusCode === HTTPResponseCode.logged) {
          setApiError('');
          navigate(`/${RoutePath.account}`);
        }
      }
    } catch (error) {
      const err = error as ErrorResponse;
      if (err.statusCode in ErorMap) {
        setApiError(ErorMap[err.statusCode]);
      } else {
        setApiError(err.message);
      }
    }
  };

  useEffect(() => {
    if (api.api.userData.isLogged) navigate(`/${RoutePath.account}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSubmitDisabled(!canSubmit(validateArr));
    setApiError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateArr, billAddressDisabled]);

  return (
    <RegisterContext.Provider
      value={
        {
          validateArr,
          setValidateArr,
          billAddressDisabled,
          setBillAddressDisabled,
          defaultShipping,
          setDefaultShipping,
          defaultBill,
          setDefaultBill,
        } as IRegisterContext
      }>
      <div className='register'>
        <form className='register__form' onSubmit={(event) => submitForm(event)}>
          <h1 className='register__heading'>Регистрация</h1>
          <p className='register__subtitle'>Создайте аккаунт, чтобы войти в личный кабинет</p>
          <SliderButton text={{ first: 'Шаг 1', second: 'Шаг 2' }} handler={sliderHandler} firstStep={firstPage} className='register__slider' />
          <RegisterStep1 className={!firstPage ? 'register__step-hidden' : ''} />
          <RegisterStep2 className={firstPage ? 'register__step-hidden' : ''} />
          {apiError ? <span className='register__errorMessage'>{apiError}</span> : ''}
          <SubmitButton text='Зарегистрироваться' disabled={submitDisabled} className='register__submit' />
          <span className='register__loginLink'>
            У вас уже есть аккаунт? <Link to='/login'>Войти</Link>
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

  const defaultAdвress = (arrKey: RegiserInputNames) => {
    if (arrKey === RegiserInputNames.shipment) {
      context.setDefaultShipping(!context.defaultShipping);
    }
    if (arrKey === RegiserInputNames.bill) {
      context.setDefaultBill(!context.defaultBill);
    }
  };

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
            val: !error ? countryMAP[event.currentTarget.value] : '',
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
      <Checkbox
        id={`checkbox ${className}`}
        handler={() => defaultAdвress(arrKey)}
        classNameWrapper='register__checkbox-defaultAddress'
        title='Сделать адресом по умолчанию'
      />
    </div>
  );
};

export default RegisterForm;
