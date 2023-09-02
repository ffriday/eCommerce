import { ICardApiData } from '../../constants/types';
import './product.scss';

interface ProductInfo {
  cardApiData?: ICardApiData;
  discounted?: boolean;
}

function ProductInfo({ discounted, cardApiData }: ProductInfo) {
  const data = cardApiData;
  const disableClassName = discounted ? 'card__price--disable' : '';
  return (
    <div className='product'>
      <h2 className='product__heading'>{data?.name}</h2>
      <p className='product__description'>{data?.description}</p>
      <div className='product__variants'>
        <div className='product__variants-info'>Размер букета</div>
        <div className='product__variants-btns'>
          {' '}
          <button className='product__variants-btn'>S</button>
          <button className='product__variants-btn'>M</button>
        </div>
      </div>
      <div className='product__bottom-box'>
        {' '}
        <div className='product__prices'>
          <span className={disableClassName}> {`${data?.price} USD/шт. `}</span>
          {discounted && <span className={'product__price product__price--discounted'}>{`${data?.price} USD/шт. `}</span>}
        </div>
        <button className='product__button'>В корзину</button>
      </div>
    </div>
  );
}
export default ProductInfo;
