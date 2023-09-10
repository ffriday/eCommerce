import { useCallback, useContext, useEffect, useState } from 'react';
import './basket.scss';
import { apiContext } from '../App';
import { Cart, ClientResponse, LocalizedString } from '@commercetools/platform-sdk';
import { HTTPResponseCode } from '../../constants/types';
import { SortParams } from '../../constants/apiClient/apiClientTypes';

interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const Basket = () => {
  const api = useContext(apiContext);

  const [cart, setCart] = useState<IProduct[]>([]);
  const [r, setR] = useState(0);

  const loadCart = useCallback(async () => {
    const cart = await api.getCart();
    if (cart.statusCode === HTTPResponseCode.ok) {
      if (cart.body.lineItems.length > 0) {
        const items: IProduct[] = cart.body.lineItems.map((lineItem) => ({
          id: lineItem.id,
          name: lineItem.name[SortParams.searchRU],
          price: Number(lineItem.price.value.centAmount) / 100,
          quantity: Number(lineItem.quantity),
        }));
        setCart(items);
      }
    }
  }, [api]);

  const addItem = useCallback(async () => await api.addProductToCart('693bd86c-6500-41c2-aa99-d169f4026976'), [api]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <div className='basket'>
      <h1 className='basket__heading'>CART</h1>
      <button onClick={addItem}>TEST</button>
      <ul>
        {cart.map(({ id, name, quantity, price }) => (
          <li key={id}>{`Product: ${name}, amount: ${quantity}, price: ${price}`}</li>
        ))}
      </ul>
    </div>
  );
};
