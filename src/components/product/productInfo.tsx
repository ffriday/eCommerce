import { apiContext } from '../App';
import { useContext, useState, useEffect, useCallback } from 'react';
import { ICardApiData } from '../../constants/types';
import { HTTPResponseCode } from '../../constants/types';
import './product.scss';

interface ProductInfo {
  isActiveLabelClass: boolean;
  cardApiData?: ICardApiData;
  discounted?: boolean;
  variant?: number;
}

function ProductInfo({ discounted, cardApiData, isActiveLabelClass, variant = 2 }: ProductInfo) {
  const [inBusket, setInBusket] = useState(false);
  const data = cardApiData;
  const api = useContext(apiContext);
  const addItem = async (id: string, variantId: number) => {
    try {
      await api.addProductToCart(id, variantId);
      setInBusket(true);
    } catch (err) {
      throw new Error(`${err}`);
    }
  };
  const addToBasketBtnHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (data) {
      await addItem(data.id, variant);

      setInBusket(true);
    }
  };

  const getLineItemId = async () => {
    try {
      if (data) {
        const res = await api.getCart();
        return res.body.lineItems.filter((item) => item.productId === data.id)[0].id;
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  };
  const removeItem = async () => {
    try {
      const lineItemId = await getLineItemId();
      if (lineItemId) {
        await api.removeProductFromCart(lineItemId, 1);
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  };
  const removeFromBasketBtnHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (data) {
      await removeItem();
      setInBusket(false);
    }
  };
  const isInBusket = async () => {
    const cart = await api.getCart();
    if (cart.statusCode === HTTPResponseCode.ok) {
      const itemInBusket = cart.body.lineItems.filter((lineItem) => lineItem.productId === data?.id);
      console.log(itemInBusket);
      setInBusket(itemInBusket.length > 0);
    }
  };

  useEffect(() => {
    isInBusket();
    console.log(inBusket);
  }, [api]);

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
        {!inBusket ? (
          <button className={'product__button'} onClick={addToBasketBtnHandler}>
            {'В корзину'}
          </button>
        ) : (
          <button className={'product__button product__button--inbusket'} onClick={removeFromBasketBtnHandler}>
            {'Удалить из корзины'}
          </button>
        )}
      </div>
    </div>
  );
}
export default ProductInfo;
