import { useContext, useEffect, useState } from 'react';
import { apiContext } from '../App';
import { ICustomerInfo } from './profileTypes';
import InputForm from '../inputForm/inputForm';
import { dateFormProps, emailFormProps, firstNameFormProps, lastNameFormProps } from '../registerForm/formProps';
import './customerProfile.scss';

interface ICustomerData {
  customerInfo: ICustomerInfo;
  update: () => void;
}

export const CustomerData = ({ customerInfo, update }: ICustomerData) => {
  const api = useContext(apiContext);
  const [data, setData] = useState(customerInfo);

  const updateData = (newData: Partial<ICustomerInfo>) => setData({ ...data, ...newData });

  useEffect(() => setData(customerInfo), [customerInfo]);

  return (
    <form className='account__data' onSubmit={(event) => null}>
      <p className='account__subtitle'>Основные данные:</p>
      <InputForm
        {...firstNameFormProps}
        // labelClassName={`${firstNameFormProps.labelClassName} ${context.validateArr.name?.className || ''}`}
        // propLabelInfo={context.validateArr.name?.err}
        // value={data.name}
        handler={(event) => updateData({ name: event.currentTarget.value })}
      />
      <InputForm
        {...lastNameFormProps}
        // labelClassName={`${lastNameFormProps.labelClassName} ${context.validateArr.surename?.className || ''}`}
        // propLabelInfo={context.validateArr.surename?.err}
        value={data.surename}
        handler={(event) => updateData({ surename: event.currentTarget.value })}
      />
      <InputForm
        {...emailFormProps}
        // labelClassName={`${emailFormProps.labelClassName} ${context.validateArr.email?.className || ''}`}
        // propLabelInfo={context.validateArr.email?.err}
        value={data.email}
        handler={(event) => updateData({ email: event.currentTarget.value })}
      />
      <InputForm
        {...dateFormProps}
        // labelClassName={`${dateFormProps.labelClassName} ${context.validateArr.birthDate?.className || ''}`}
        // propLabelInfo={context.validateArr.birthDate?.err}
        value={data.birthDate}
        handler={(event) => updateData({ birthDate: event.currentTarget.value })}
      />
    </form>
  );
};
