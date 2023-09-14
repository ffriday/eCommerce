import { useCallback, useContext, useEffect, useState } from 'react';
import { apiContext } from '../App';
import { HTTPResponseCode } from '../../constants/types';
import { CartDiscount } from '@commercetools/platform-sdk';
import { SortParams } from '../../constants/apiClient/apiClientTypes';

interface IPromoCodeItem {
  code: CartDiscount;
}

export const PromocodeItem = ({ code: { id, name, description, key } }: IPromoCodeItem) => {
  return (
    <li>
      <strong>{name[SortParams.searchEN]}</strong>
    </li>
  );
};
