// import React, { memo } from 'react';
import './catalog.scss';
// import ProductCard from '../card/card';
// import { ICatalogApiData } from '../../constants/types';
import InputForm from '../inputForm/inputForm';
import { IInputhandler } from '../../constants/types';

interface IFiterSortPanel {
  priceFromValue: string;
  priceToValue: string;
  filterPriceHandler: () => void;
  inputPriceFilterhandler: IInputhandler;
}

const FiterSortPanel = ({ priceFromValue, priceToValue, filterPriceHandler, inputPriceFilterhandler }: IFiterSortPanel) => {
  return (
    <>
      <form className='filter'>
        <div className='filter__btn' onClick={filterPriceHandler}>
          Отфильтруйте по цене в $
        </div>
        <div className='filter__inputs'>
          <InputForm
            name='from'
            value={priceFromValue}
            handler={inputPriceFilterhandler}
            type='number'
            id='from'
            placeholder='от .. '
            inputClassName='filter__price-from'
          />
          <InputForm
            name='to'
            value={priceToValue}
            handler={inputPriceFilterhandler}
            type='number'
            id='to'
            placeholder='до .. '
            inputClassName='filter__price-to'
          />
        </div>
      </form>
    </>
  );
};
export default FiterSortPanel;
