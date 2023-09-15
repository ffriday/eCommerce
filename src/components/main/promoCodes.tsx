import { useCallback, useContext, useEffect, useState } from 'react';
import { apiContext } from '../App';
import { HTTPResponseCode } from '../../constants/types';
import { CartDiscount } from '@commercetools/platform-sdk';
import { PromocodeItem } from './promoCodeItem';
import './promocode.scss';

export const Promocodes = () => {
  const api = useContext(apiContext);
  const [promocodes, setPromcodes] = useState<CartDiscount[]>([]);

  const loadCartCodes = useCallback(async () => {
    try {
      const {
        statusCode,
        body: { count, results },
      } = await api.getCartDiscounts();
      if (statusCode === HTTPResponseCode.ok && count > 0) {
        setPromcodes(results.filter(({ isActive }) => isActive));
      }
    } catch (err) {
      null; //TODO - handle error
    }
  }, [api]);

  useEffect(() => {
    loadCartCodes();
  }, [loadCartCodes]);

  return (
    <>
      {promocodes.length > 0 ? (
        <div className='promo'>
          <p className='promo__heading'>Промокоды:</p>
          <ul>
            {promocodes.map((code) => (
              <PromocodeItem key={code.id} code={code} />
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};
