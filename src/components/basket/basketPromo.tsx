import { useContext } from 'react';
import { IBasketPromo } from '../../constants/types';
import { apiContext } from '../App';

export const BasketPromo = ({ promocodeId, promocodes, removeHandler }: IBasketPromo) => {
  const api = useContext(apiContext);

  const promoArr = promocodes.filter(({ id }) => {
    return id === promocodeId;
  });
  const { id, name, key } = promoArr[0] || { id: '', name: '', key: '' };

  return (
    <div>
      <p>Промокод активирован:</p>
      <p>{`${key} - ${name}`}</p>
      <button className='basket__remove-all' onClick={() => removeHandler(id)}></button>
    </div>
  );
};
