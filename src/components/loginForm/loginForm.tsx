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
const LoginForm = () => {
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const [passwordPlaceholder, setPasswordPlaceholder] = useState<IInputLabel>({ labelInfo: 'Ваш пароль', labelClassNameInvailid: '' });
  const [emailLabel, setEmailLabel] = useState<IInputLabel>({ labelInfo: '', labelClassNameInvailid: '' });
  const [passwordLabel, setPasswordLabel] = useState<IInputLabel>({ labelInfo: '', labelClassNameInvailid: '' });
  const valiadation = (formData: IformData) => {
    const formErrors: IFormErrors = {};
    if (!formData.email) {
      formErrors.email = 'Необходимо ввести email';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      formErrors.email = 'введите корректный email';
    }
    if (!formData.password) {
      formErrors.password = 'Необходимо ввести пароль';
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
    if (errorsData.email === 'введите корректный email') {
      setEmailLabel({ labelInfo: errorsData.email, labelClassNameInvailid: 'invailid-label' });
    }
    if (!errorsData.email) {
      setEmailLabel({ labelInfo: 'email корректный', labelClassNameInvailid: 'vailid-label' });
    }
    setIsButtonDisable(false);
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
