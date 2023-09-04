import { Address } from '@commercetools/platform-sdk';
import './customerProfile.scss';
// import { useContext } from 'react';
// import { apiContext } from '../App';
import { ICustomerReaction } from './customerProfile';
import { EditCustomerAddress } from './editCustomerAddress';
import { IAddressTypes } from './profileTypes';

interface ICustomerAddresses extends ICustomerReaction {
  customerAddress: Address[] | undefined;
  addressTypes: IAddressTypes;
}

export const CustomerAddress = ({ customerAddress, update, showError, addressTypes }: ICustomerAddresses) => {
  // const api = useContext(apiContext);

  return (
    <div className='account__addresses'>
      {customerAddress
        ? customerAddress.map((addr, i) => (
          <EditCustomerAddress
            key={`editAddress-${i}`}
            address={addr}
            addressTypes={addressTypes}
            update={update}
            showError={showError}
            buttons={{ edit: true, remove: true }}
          />
        ))
        : null}
      <EditCustomerAddress key={'addAddress'} update={update} showError={showError} buttons={{ add: true }} />
    </div>
  );
};
