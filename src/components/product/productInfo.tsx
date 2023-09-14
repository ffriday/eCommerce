import { ICardApiData } from '../../constants/types';
import { IMouthhandler } from '../../constants/types';
import './product.scss';

interface ProductInfo {
  isActiveLabelClass: boolean;
  cardApiData?: ICardApiData;
  discounted?: boolean;
  inBusket: boolean;
  addToBasketBtnHandler: IMouthhandler;
  removeFromBasketBtnHandler: IMouthhandler;
}

function ProductInfo({ discounted, cardApiData, isActiveLabelClass, addToBasketBtnHandler, removeFromBasketBtnHandler, inBusket }: ProductInfo) {
  const data = cardApiData;

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
