import { useCallback, useContext, useEffect, useState } from 'react';
import './basket.scss';
import { apiContext } from '../App';
import { Cart, ClientResponse } from '@commercetools/platform-sdk';

export const Basket = () => {
  const api = useContext(apiContext);

  const [cart, setCart] = useState<ClientResponse<Cart> | null>(null);

  const loadCart = useCallback(async () => setCart(await api.getCart()), [api]);
  // const customer = useCallback(async () => await cart?.body.customerId ? api.getCustomerInfo(), [api]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // useEffect(() => {

  // }, [cart]);

  return (
    <div className='basket'>
      <h1 className='basket__heading'>{cart?.body.customerId}</h1>
    </div>
  );
};
