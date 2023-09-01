import { useContext, useEffect, useState } from 'react';
import { apiContext } from '../App';
import { ICustomerInfo } from './profileTypes';
import InputForm from '../inputForm/inputForm';
import { dateFormProps, emailFormProps, emailPattern, firstNameFormProps, lastNameFormProps, namePattern } from '../registerForm/formProps';
import './customerProfile.scss';
import { checkDate, checkInput } from '../../constants/formValidation';
import { isPattern } from '@babel/types';
import { IPattern } from '../registerForm/registerForm';

interface ICustomerData {
  customerInfo: ICustomerInfo;
  update: () => void;
}

export const CustomerData = ({ customerInfo, update }: ICustomerData) => {
  const api = useContext(apiContext);
  const [data, setData] = useState(customerInfo);

  const [name, setName] = useState('');
  const [surename, setSurename] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const updateData = (newData: Partial<ICustomerInfo>) => {
    if (newData.name) {
      const { err } = checkInput(newData.name, namePattern);
      setName(err);
    }
    if (newData.surename) {
      const { err } = checkInput(newData.surename, namePattern);
      setSurename(err);
    }
    if (newData.email) {
      const { err } = checkInput(newData.email, emailPattern);
      setEmail(err);
    }
    if (newData.birthDate) {
      const { err } = checkDate(newData.birthDate, 13);
      setBirthDate(err);
    }
    setData({ ...data, ...newData });
  };

  useEffect(() => setData(customerInfo), [customerInfo]);

  return (
    <form className='account__data' onSubmit={(event) => null}>
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
    </form>
  );
};
