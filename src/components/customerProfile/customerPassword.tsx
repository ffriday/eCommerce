import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiContext } from '../App';
import InputForm from '../inputForm/inputForm';
import { passwordCheckFormProps, passwordFormProps, passwordPattern } from '../registerForm/formProps';
import './customerProfile.scss';
import { checkInput } from '../../constants/formValidation';
import SubmitButton from '../submitButton/submitButton';
import { IShowError, RoutePath } from '../../constants/types';

interface ICustomerPassword {
  update: () => void;
  showError: IShowError;
}

interface IChangePassword {
  oldPwd: string;
  newPwd: string;
}

export const CustomerPassword = ({ update, showError }: ICustomerPassword) => {
  const api = useContext(apiContext);
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [submit, setSubmit] = useState(false);

  const updateData = ({ oldPwd, newPwd }: Partial<IChangePassword>) => {
    let error = !oldPassword || !newPassword;
    if (oldPwd) {
      const { err } = checkInput(oldPwd, passwordPattern);
      if (err) error = true;
      setOldPasswordError(err);
    }
    if (newPwd) {
      const { err } = checkInput(newPwd, passwordPattern);
      if (err) error = true;
      setNewPasswordError(err);
    }
    setSubmit(!error);
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    showError('');
    try {
      await api.changePassword(oldPassword, newPassword);
      setSubmit(false);
      window.setTimeout(update, 300); // Wati for server response
      setSubmit(true);
      api.logOutCustomer();
      navigate(`/${RoutePath.login}`);
    } catch (error) {
      if (error) {
        showError(error.toString());
      }
    }
  };

  useEffect(() => {
    if (newPassword && oldPassword && newPassword === oldPassword) {
      setSubmit(false);
      setNewPasswordError('Пароли не должны совпадать');
    }
  }, [newPassword, oldPassword]);

  return (
    <form className='account__data' onSubmit={(event) => submitForm(event)}>
      <p className='account__subtitle'>Пароль:</p>
      <InputForm
        {...passwordFormProps}
        placeholder='Старый пароль'
        labelClassName={`${passwordFormProps.labelClassName} ${oldPasswordError ? 'invailid-label' : 'vailid-label'}`}
        propLabelInfo={oldPasswordError}
        value={oldPassword}
        handler={(event) => {
          setOldPassword(event.currentTarget.value);
          updateData({ oldPwd: event.currentTarget.value });
        }}
      />
      <InputForm
        {...passwordCheckFormProps}
        placeholder='Новый пароль'
        labelClassName={`${passwordFormProps.labelClassName} ${newPasswordError ? 'invailid-label' : 'vailid-label'}`}
        propLabelInfo={newPasswordError}
        value={newPassword}
        handler={(event) => {
          setNewPassword(event.currentTarget.value);
          updateData({ newPwd: event.currentTarget.value });
        }}
      />

      <SubmitButton text='Изменить пароль' disabled={!submit} className='account__submit' />
    </form>
  );
};
