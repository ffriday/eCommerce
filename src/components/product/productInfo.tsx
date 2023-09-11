import { apiContext } from '../App';
import { useContext, useState, useEffect, useCallback } from 'react';
import { ICardApiData } from '../../constants/types';
import { HTTPResponseCode } from '../../constants/types';
import './product.scss';

interface ProductInfo {
  isActiveLabelClass: boolean;
  cardApiData?: ICardApiData;
  discounted?: boolean;
}

function ProductInfo({ discounted, cardApiData, isActiveLabelClass }: ProductInfo) {
  const data = cardApiData;
  const api = useContext(apiContext);
  const handler = async () => {
    await isInBusket();
  };
  const isInBusket = useCallback(async () => {
    const cart = await api.getCart();
    if (cart.statusCode === HTTPResponseCode.ok) {
      const itemInBusket = cart.body.lineItems.filter((lineItem) => lineItem.productId === data?.id);
      setInBusket(itemInBusket.length > 0);
    }
  }, [api, handler]);
  const [inBusket, setInBusket] = useState(false);

  useEffect(() => {
    isInBusket();
  }, []);

  const disableClassName = discounted ? 'card__price--disable' : '';
  const activeLabelClass = 'product__variants-label--active';
  return (
    <div className='product'>
      <h2 className='product__heading'>{data?.name}</h2>
      <p className='product__description'>{data?.description}</p>
      <div className='product__variants'>
        <div className='product__variants-info'>Размер букета</div>
        <div className='product__variants-labels'>
          {' '}
          <div className={`product__variants-label ${isActiveLabelClass && activeLabelClass}`}>S</div>
          <div className={`product__variants-label ${!isActiveLabelClass && activeLabelClass}`}>M</div>
        </div>
      </div>
      <div className='product__bottom-box'>
        {' '}
        <div className='product__prices'>
          <span className={disableClassName}> {`${data?.price} USD/шт. `}</span>
          {discounted && (
            <span className={'product__price product__price--discounted'}>{`${discounted ? data?.discPrice : data?.price} USD/шт. `}</span>
          )}
        </div>
        <button className='product__button' onClick={async () => await isInBusket()}>
          {inBusket ? 'Удалить из корзины' : 'В корзину'}
        </button>
      </div>
    </div>
  );
}
export default ProductInfo;
