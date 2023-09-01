import React, { useContext, useEffect, useState } from 'react';
import { apiContext } from '../App';
import { ICustomerInfo } from './profileTypes';
import InputForm from '../inputForm/inputForm';
import { dateFormProps, emailFormProps, emailPattern, firstNameFormProps, lastNameFormProps, namePattern } from '../registerForm/formProps';
import './customerProfile.scss';
import { checkDate, checkInput } from '../../constants/formValidation';
import SubmitButton from '../submitButton/submitButton';

type IShowError = (error: string) => void;

interface ICustomerData {
  customerInfo: ICustomerInfo;
  update: () => void;
  showError: IShowError;
}

export const CustomerData = ({ customerInfo, update, showError }: ICustomerData) => {
  const api = useContext(apiContext);
  const [data, setData] = useState(customerInfo);

  const [name, setName] = useState('');
  const [surename, setSurename] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [submit, setSubmit] = useState(true);

  const updateData = (newData: Partial<ICustomerInfo>) => {
    let error = false;
    if (newData.name) {
      const { err } = checkInput(newData.name, namePattern);
      if (err) error = true;
      setName(err);
    }
    if (newData.surename) {
      const { err } = checkInput(newData.surename, namePattern);
      if (err) error = true;
      setSurename(err);
    }
    if (newData.email) {
      const { err } = checkInput(newData.email, emailPattern);
      if (err) error = true;
      setEmail(err);
    }
    if (newData.birthDate) {
      const { err } = checkDate(newData.birthDate, 13);
      if (err) error = true;
      setBirthDate(err);
    }
    setData({ ...data, ...newData });
    setSubmit(!error);
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    showError('');
    try {
      await api.editCustomer({ name: data.name, surename: data.surename, email: data.email, birthDate: data.birthDate });
      setSubmit(false);
      window.setTimeout(update, 300); // Wati for server response
      setSubmit(true);
    } catch (error) {
      if (error) {
        showError(error.toString());
      }
    }
  };

  useEffect(() => setData(customerInfo), [customerInfo]);

  return (
    <form className='account__data' onSubmit={(event) => submitForm(event)}>
      <p className='account__subtitle'>Основные данные:</p>
      <InputForm
        {...firstNameFormProps}
        labelClassName={`${firstNameFormProps.labelClassName} ${name ? 'invailid-label' : 'vailid-label'}`}
        propLabelInfo={name}
        value={data.name}
        handler={(event) => updateData({ name: event.currentTarget.value })}
      />
      <InputForm
        {...lastNameFormProps}
        labelClassName={`${lastNameFormProps.labelClassName} ${surename ? 'invailid-label' : 'vailid-label'}`}
        propLabelInfo={surename}
        value={data.surename}
        handler={(event) => updateData({ surename: event.currentTarget.value })}
      />
      <InputForm
        {...emailFormProps}
        labelClassName={`${emailFormProps.labelClassName} ${email ? 'invailid-label' : 'vailid-label'}`}
        propLabelInfo={email}
        value={data.email}
        handler={(event) => updateData({ email: event.currentTarget.value })}
      />
      <InputForm
        {...dateFormProps}
        labelClassName={`${dateFormProps.labelClassName} ${birthDate ? 'invailid-label' : 'vailid-label'}`}
        propLabelInfo={birthDate}
        value={data.birthDate}
        handler={(event) => updateData({ birthDate: event.currentTarget.value })}
      />
      <SubmitButton text='Обновить основные данные' disabled={!submit} className='account__submit' />
    </form>
  );
};
