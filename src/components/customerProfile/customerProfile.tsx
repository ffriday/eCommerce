import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './customerProfile.scss';
import { apiContext } from '../App';
import { IShowError, RoutePath } from '../../constants/types';
import ApiClient from '../../constants/apiClient/apiClient';
import { IAddressTypes, ICustomerInfo, IParsedCustomer } from './profileTypes';
import { Address } from '@commercetools/platform-sdk';
import { CustomerData } from './customerData';
import { CustomerAddress } from './customerAddress';
import { CustomerPassword } from './customerPassword';

export interface ICustomerReaction {
  update: () => void;
  showError: IShowError;
}

const getCustomer = async (api: ApiClient): Promise<IParsedCustomer> => {
  const customer = await api.getCustomerInfo();
  const customerInfo: ICustomerInfo = {
    name: customer.body.firstName || '',
    surename: customer.body.lastName || '',
    email: customer.body.email || '',
    birthDate: customer.body.dateOfBirth || '',
  };
  const addressTypes: IAddressTypes = {
    billing: customer.body.shippingAddressIds || [],
    shipping: customer.body.billingAddressIds || [],
    defaultBilling: customer.body.defaultShippingAddressId || '',
    defaultShipping: customer.body.defaultBillingAddressId || '',
  };
  return { info: customerInfo, address: customer.body.addresses, addressTypes };
};

export const CustomerProfile = () => {
  const navigate = useNavigate();
  const api = useContext(apiContext);

  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo>({ name: '', surename: '', email: '', birthDate: '' });
  const [customerAddress, setCustomerAddress] = useState<Address[]>([]);
  const [customerAddressTypes, setCustomerAddressTypes] = useState<IAddressTypes>({
    billing: [],
    shipping: [],
    defaultBilling: '',
    defaultShipping: '',
  });
  const [changeCustomer, setChangeCustomer] = useState(0);

  const [error, setError] = useState('');

  const update = () => setChangeCustomer(changeCustomer + 1); // Made for calling state update from component
  const showError = (error: string) => setError(error);

  useEffect(() => {
    // Redirect if user not logged in
    if (!api.api.userData.isLogged) navigate(`/${RoutePath.login}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Load customer data
    (async () => {
      try {
        const customer = await getCustomer(api);
        if (customer) {
          setCustomerInfo(customer.info);
          if (customer.address) setCustomerAddress(customer.address);
          if (customer.addressTypes) setCustomerAddressTypes(customer.addressTypes);
        }
      } catch (err) {
        setError('Service unavalible');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCustomer]);

  return (
    <div className='account'>
      <h1 className='account__heading'>{`Профиль пользователя ${customerInfo.name} ${customerInfo.surename}`}</h1>
      <CustomerData customerInfo={customerInfo} update={update} showError={showError} />
      <CustomerPassword update={update} showError={showError} />
      <CustomerAddress customerAddress={customerAddress} addressTypes={customerAddressTypes} update={update} showError={showError} />
      {error ? <span className='account__errorMessage'>{error}</span> : null}
      <button
        className='account__logout'
        onClick={() => {
          api.logOutCustomer();
          navigate('/');
        }}>
        Разлогиниться
      </button>
    </div>
  );
};
