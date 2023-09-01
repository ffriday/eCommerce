import { useContext } from 'react';
import { apiContext } from '../App';
import { ICustomerInfo } from './profileTypes';

interface ICustomerData {
  customerInfo: ICustomerInfo;
  update: () => void;
}

export const CustomerData = ({ customerInfo, update }: ICustomerData) => {
  const api = useContext(apiContext);

  return (
    <div>
      {customerInfo.name}, {customerInfo.surename}, {customerInfo.email}, {customerInfo.birthDate}
    </div>
  );
};
