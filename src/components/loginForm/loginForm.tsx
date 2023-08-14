import './loginForm.scss';
import SubmitButton from '../submitButton/submitButton';
import InputForm from '../inputForm/inputForm';
import Checkbox from '../checkbox/checkbox';
import { useState } from 'react';
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
interface IInputPlaceholder {
  placeholderInfo: string;
  placeholderClassNameInvailid: string;
}
const LoginForm = () => {
  const [emailPlaceholder, setEmailPlaceholder] = useState<IInputPlaceholder>({
    placeholderInfo: 'Ваш e-mail',
    placeholderClassNameInvailid: '',
  });
  const [passwordPlaceholder, setPasswordPlaceholder] = useState<IInputPlaceholder>({
    placeholderInfo: 'Ваш пароль',
    placeholderClassNameInvailid: '',
  });
  const [emailLabel, setEmailLabel] = useState<IInputLabel>({ labelInfo: '', labelClassNameInvailid: '' });
  const valiadation = (formData: IformData) => {
    const formErrors: IFormErrors = {};
    if (!formData.email) {
      formErrors.email = 'Необходимо ввести email';
    }
    // else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    //   formErrors.email = formErrorsInfo.emailInvalid;
    // }
    if (!formData.password) {
      formErrors.password = 'Необходимо ввести email';
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
    if (errorsData.email) {
      setEmailPlaceholder({ placeholderInfo: errorsData.email, placeholderClassNameInvailid: 'invailid' });
      // setEmailLabel({ labelInfo: errorsData.email, labelClassNameInvailid: 'invailid' });
    }
    if (errorsData.password) {
      setPasswordPlaceholder({ placeholderInfo: errorsData.password, placeholderClassNameInvailid: 'invailid' });
    }
  };
  function actionEmail() {
    setEmailPlaceholder({ placeholderInfo: 'Ваш e-mail', placeholderClassNameInvailid: '' });
    setEmailLabel({ labelInfo: '', labelClassNameInvailid: '' });
  }
  function actionPassword() {
    setPasswordPlaceholder({ placeholderInfo: 'Ваш пароль', placeholderClassNameInvailid: '' });
  }
  return (
    <div className='login'>
      <form className='login__form' onSubmit={handleSubmit}>
        <h1 className='login__heading'>Добро пожаловать!</h1>
        <p className='login__subtitle'>Введите данные, чтобы войти в личный кабинет</p>
        <InputForm
          name='email'
          type='email'
          id='email'
          placeholder={emailPlaceholder.placeholderInfo}
          action={actionEmail}
          inputClassName={`login__email ${emailPlaceholder.placeholderClassNameInvailid}`}
          labelClassName={emailLabel.labelClassNameInvailid}
          propLabelInfo={emailLabel.labelInfo}
        />
        <InputForm
          name='password'
          type='password'
          id='password'
          placeholder={passwordPlaceholder.placeholderInfo}
          action={actionPassword}
          inputClassName={`login__password ${passwordPlaceholder.placeholderClassNameInvailid}`}
        />
        <Checkbox
          id='checkbox'
          handler={() => 'test action'}
          classNameWrapper='login__checkbox'
          title='Запомнить меня'
          link={{ path: '#', text: 'Забыли пароль?' }}
        />
        <SubmitButton text='Войти' disabled={false} />
        <span className='login__link-label'>
          Нет аккаунта?<a className='login__link'>Создать новый аккаунт</a>
        </span>
      </form>
    </div>
  );
};

export default LoginForm;
