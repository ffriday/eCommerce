import { useState, useEffect, useMemo, useContext } from 'react';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';
import './product.scss';
import ProductInfo from './productInfo';

import { ICardApiData } from '../../constants/types';
import { Slider } from './productSlider';
export const Product = () => {
  const api = useContext(apiContext);
  const productAdapter = useMemo(() => new ProductAdapter(api), [api]);

  const [isVariant, setIsVariant] = useState(false);
  const [productData, setProductData] = useState<ICardApiData>({ image: '', name: '', description: '', price: '', id: '' });
  const [productsData, setProductsData] = useState<ICardApiData[]>([{ image: '', name: '', description: '', price: '', id: '' }]);
  const swiperHandler = async () => {
    setIsVariant(!isVariant);
  };

  useEffect(() => {
    const getData = async () => {
      const product1: ICardApiData = await productAdapter.getProductByKey({ key: 'nude' });
      const product2: ICardApiData = await productAdapter.getProductByKey({ key: 'nude', productVariant: true });
      console.log(product2);
      const products: ICardApiData[] = [product1, product2];
      isVariant ? setProductData(product1) : setProductData(product2);
      setProductsData(products);
    };
    getData();
  }, [productAdapter, isVariant]);
  return (
    <div className='product__container'>
      <Slider sliders={productsData} swiperHandler={swiperHandler} />
      <ProductInfo isActiveLabelClass={isVariant} cardApiData={productData} />
    </div>
  );
};
