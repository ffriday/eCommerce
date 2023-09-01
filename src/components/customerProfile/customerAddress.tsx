import { useContext } from 'react';
import { apiContext } from '../App';
import { ICustomerInfo } from './profileTypes';
import { Address } from '@commercetools/platform-sdk';

interface ICustomerAddress {
  customerAddress: Address[] | undefined;
  update: () => void;
}

export const CustomerAddress = ({ customerAddress, update }: ICustomerAddress) => {
  const api = useContext(apiContext);
  // console.log('ADDR', customerAddress);

  return <div>{customerAddress ? customerAddress.map((val) => val.country) : ''}</div>;
};
