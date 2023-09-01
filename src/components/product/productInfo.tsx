import { useState, useEffect, useMemo, useContext } from 'react';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';
import { ICardApiData } from '../../constants/types';
import './product.scss';

interface ProductInfo {
  cardApiData?: ICardApiData;
  discounted?: boolean;
}

function ProductInfo({ discounted, cardApiData = { image: '', name: '', description: '', price: '', id: '' } }: ProductInfo) {
  const api = useContext(apiContext);
  const productAdapter = useMemo(() => new ProductAdapter(api), [api]);
  const [productData, setProductData] = useState<ICardApiData>({ image: '', name: '', description: '', price: '', id: '' });
  const data = productData;
  const disableClassName = discounted ? 'card__price--disable' : '';
  useEffect(() => {
    const getData = async () => {
      const product: ICardApiData = await productAdapter.getProductByKey({ key: 'nude', productVariant: 0 });
      setProductData(product);
    };
    getData();
  }, [productAdapter]);
  return (
    <div className='product'>
      <h2 className='product__heading'>{data?.name}</h2>
      <p className='product__description'>{data?.description}</p>
      <div className='product__variants'>
        <button className='product__variants-btn'>S</button>
        <button className='product__variants-btn'>M</button>
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
