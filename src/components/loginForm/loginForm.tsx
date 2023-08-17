import './loginForm.scss';
import SubmitButton from '../submitButton/submitButton';
import InputForm from '../inputForm/inputForm';
import Checkbox from '../checkbox/checkbox';
import { useState } from 'react';
import { EmailErrors } from '../../constants/types';
import { PasswordErrors } from '../../constants/types';

interface IformData {
  email: string | null;
  password: string | null;
}
interface IFormErrors {
  email?: string;
  password?: string;
}
interface IInputLabel {
  labelInfo: string;
  labelClassNameInvailid: string;
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const [passwordPlaceholder, setPasswordPlaceholder] = useState<IInputLabel>({ labelInfo: 'Ваш пароль', labelClassNameInvailid: '' });
  const [emailLabel, setEmailLabel] = useState<IInputLabel>({ labelInfo: '', labelClassNameInvailid: '' });
  const [passwordLabel, setPasswordLabel] = useState<IInputLabel>({ labelInfo: '', labelClassNameInvailid: '' });
  const valiadation = (formData: IformData) => {
    const formErrors: IFormErrors = {};
    if (!formData.email) {
      formErrors.email = EmailErrors.missing;
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
        formErrors.email = EmailErrors.invalidFormat;
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+$/i.test(formData.email)) {
          formErrors.email = EmailErrors.noTopLevelDomain;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.\w{2,4}$/i.test(formData.email)) {
          formErrors.email = EmailErrors.shortDomain;
        }
      }
    }
    if (!formData.password) {
      formErrors.password = PasswordErrors.missing;
    } else {
      const passwordLength = formData.password.length;

      if (!/^[A-Za-z].*/.test(formData.password)) {
        formErrors.password = PasswordErrors.notInLatin;
      } else if (passwordLength < 8) {
        formErrors.password = PasswordErrors.tooShort;
      } else if (!/[A-Z]/.test(formData.password)) {
        formErrors.password = PasswordErrors.missingUppercase;
      } else if (!/[a-z]/.test(formData.password)) {
        formErrors.password = PasswordErrors.missingLowercase;
      } else if (!/[0-9]/.test(formData.password)) {
        formErrors.password = PasswordErrors.missingDigit;
      } else if (!/[!@#$%^&*]/.test(formData.password)) {
        formErrors.password = PasswordErrors.missingSpecialChar;
      } else if (formData.password !== formData.password.trim()) {
        formErrors.password = PasswordErrors.leadingTrailingSpace;
      }
    }

    return formErrors;
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const formData: IformData = {
      email: new FormData(target).get('email') as string,
      password: new FormData(target).get('password') as string,
    };
    const errorsData: IFormErrors = valiadation(formData);
    if (errorsData.password) {
      setPasswordPlaceholder({ labelInfo: errorsData.password, labelClassNameInvailid: 'invailid' });
    }
  };

  const inputValidation = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLFormElement;
    const formData: IformData = {
      email: target.id === 'email' ? (target.value as string) : '',
      password: target.id === 'password' ? (target.value as string) : '',
    };
    const errorsData: IFormErrors = valiadation(formData);
    if (!target.value) {
      setEmailLabel({ labelInfo: target.id === 'email' ? '' : '', labelClassNameInvailid: 'disable' });
      setPasswordLabel({ labelInfo: target.id === 'password' ? '' : '', labelClassNameInvailid: 'disable' });
    }
    if (target.value) {
      setEmailLabel({ labelInfo: target.id === 'email' ? 'Ваш email' : '', labelClassNameInvailid: '' });
      setPasswordLabel({ labelInfo: target.id === 'password' ? 'Ваш пароль' : '', labelClassNameInvailid: '' });
    }
    if (target.id === 'email') {
      setEmail(target.value);
    } else if (target.id === 'password') {
      setPassword(target.value);
    }
    if (
      ((!errorsData.password || errorsData.password === PasswordErrors.missingSpecialChar) &&
        ((errorsData.email === EmailErrors.missing && email) || !errorsData.email)) ||
      (!errorsData.email && ((errorsData.password === PasswordErrors.missing && password) || !errorsData.password))
    ) {
      setIsButtonDisable(false);
    } else {
      setIsButtonDisable(true);
    }

    if (errorsData.email && errorsData.email !== EmailErrors.missing) {
      setEmailLabel({ labelInfo: errorsData.email, labelClassNameInvailid: 'invailid-label' });
    }
    if (!errorsData.email) {
      setEmailLabel({ labelInfo: 'email корректный', labelClassNameInvailid: 'vailid-label' });
    }
    if (errorsData.password && errorsData.password !== PasswordErrors.missing) {
      setPasswordLabel({ labelInfo: errorsData.password, labelClassNameInvailid: 'invailid-label' });
    }
    if (!errorsData.password) {
      setPasswordLabel({ labelInfo: 'пароль корректный', labelClassNameInvailid: 'vailid-label' });
    }
  };

  function onChangeHandler(event: React.FormEvent<HTMLInputElement>) {
    inputValidation(event);
  }
  return (
    <div className='login'>
      <form className='login__form' onSubmit={handleSubmit}>
        <h1 className='login__heading'>Добро пожаловать!</h1>
        <p className='login__subtitle'>Введите данные, чтобы войти в личный кабинет</p>
        <InputForm
          name='email'
          type='text'
          id='email'
          placeholder={'Ваш email'}
          handler={onChangeHandler}
          value={email}
          inputClassName={'login__email'}
          labelClassName={emailLabel.labelClassNameInvailid}
          propLabelInfo={emailLabel.labelInfo}
        />
        <InputForm
          name='password'
          type='password'
          id='password'
          placeholder={passwordPlaceholder.labelInfo}
          handler={onChangeHandler}
          value={password}
          inputClassName={`login__password ${passwordPlaceholder.labelClassNameInvailid}`}
          labelClassName={passwordLabel.labelClassNameInvailid}
          propLabelInfo={passwordLabel.labelInfo}
        />
        <Checkbox
          id='checkbox'
          handler={() => 'test action'}
          classNameWrapper='login__checkbox'
          title='Запомнить меня'
          link={{ path: '#', text: 'Забыли пароль?' }}
        />
        <SubmitButton text='Войти' disabled={isButtonDisable} />
        <span className='login__link-label'>
          Нет аккаунта?<a className='login__link'>Создать новый аккаунт</a>
        </span>
      </form>
    </div>
  );
};

export default LoginForm;
