// import { useContext } from 'react';
// import { apiContext } from '../App';
import { Address } from '@commercetools/platform-sdk';
import './customerProfile.scss';

interface ICustomerAddress {
  customerAddress: Address[] | undefined;
  update: () => void;
}

export const CustomerAddress = ({ customerAddress }: ICustomerAddress) => {
  // add update
  // const api = useContext(apiContext);

  return <div>{customerAddress ? customerAddress.map((val) => val.country) : ''}</div>;
};
