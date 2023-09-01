import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './customerProfile.scss';
import { apiContext } from '../App';
import { RoutePath } from '../../constants/types';
import ApiClient from '../../constants/apiClient/apiClient';
import { ICustomerInfo, IParsedCustomer } from './profileTypes';
import { Address } from '@commercetools/platform-sdk';
import { CustomerData } from './customerData';
import { CustomerAddress } from './customerAddress';

const getCustomer = async (api: ApiClient): Promise<IParsedCustomer> => {
  const customer = await api.getCustomerInfo();
  const customerInfo: ICustomerInfo = {
    name: customer.body.firstName || '',
    surename: customer.body.lastName || '',
    email: customer.body.email || '',
    birthDate: customer.body.dateOfBirth || '',
  };
  return { info: customerInfo, address: customer.body.addresses };
};

export const CustomerProfile = () => {
  const navigate = useNavigate();
  const api = useContext(apiContext);

  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo>({ name: '', surename: '', email: '', birthDate: '' });
  const [customerAddress, setCustomerAddress] = useState<Address[]>([]);
  const [error, setError] = useState('');
  const [changeCustomer, setChangeCustomer] = useState(0);

  const update = () => setChangeCustomer(changeCustomer + 1); // Made for calling state update from component

  useEffect(() => {
    // Redirect if user not logged in
    if (api.api.userData.isLogged) navigate(`/${RoutePath.account}`);
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
        }
      } catch (err) {
        setError('Service unavalible');
      }
    })();
  }, [changeCustomer, api]);

  return (
    <div className='account'>
      <h1 className='account__heading'>{`Профиль пользователя ${customerInfo.name} ${customerInfo.surename}`}</h1>
      <CustomerData customerInfo={customerInfo} update={update} />
      <CustomerAddress customerAddress={customerAddress} update={update} />
      <button
        className='account__logout'
        onClick={() => {
          api.logOutCustomer();
          navigate('/');
        }}>
        Разлогиниться
      </button>
      {/* TODO - add ERROR message */}
    </div>
  );
};
