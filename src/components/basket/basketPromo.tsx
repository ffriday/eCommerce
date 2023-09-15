import { useContext, useCallback, useEffect, useState } from 'react';
import { HTTPResponseCode, IBasketPromo } from '../../constants/types';
import { apiContext } from '../App';
import { SortParams } from '../../constants/apiClient/apiClientTypes';

export const BasketPromo = ({ promocodeId, removeHandler, errorHandler }: IBasketPromo) => {
  const api = useContext(apiContext);

  const [promo, setPromo] = useState({ id: '', name: '', description: '', code: '' });

  const promoParams = useCallback(async () => {
    try {
      const {
        statusCode,
        body: { id, name, description, code },
      } = await api.getDiscount(promocodeId);
      if (statusCode === HTTPResponseCode.ok) {
        const correctName = name ? name[SortParams.searchEN] : '';
        const correctDescription = description ? description[SortParams.searchEN] : '';
        setPromo({ id, name: correctName, description: correctDescription, code });
      }
    } catch (err) {
      if (err instanceof Error) {
        errorHandler(err.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    promoParams();
  }, [promoParams]);

  return (
    <div>
      <p>Промокод активирован:</p>
      <div className='basket__active-promo'>
        <p className='basket__promo-name'>{`${promo.code} - ${promo.description}`}</p>
        <button className='basket__remove-promo' onClick={() => removeHandler(promo.id)}></button>
      </div>
    </div>
  );
};
