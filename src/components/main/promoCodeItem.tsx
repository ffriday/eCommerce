import { CartDiscount } from '@commercetools/platform-sdk';
import { SortParams } from '../../constants/apiClient/apiClientTypes';

interface IPromoCodeItem {
  code: CartDiscount;
}

export const PromocodeItem = ({ code: { name, description, key } }: IPromoCodeItem) => {
  return (
    <li className='promo__item'>
      <p className='promo__name'>{name[SortParams.searchEN]}</p>
      <p className='promo__description'>{description && description[SortParams.searchEN]}</p>
      <p className='promo__key'>{key && key}</p>
    </li>
  );
};
