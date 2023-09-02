import { useState, useEffect, useMemo, useContext } from 'react';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';
import './product.scss';
import ProductInfo from './productInfo';

import { ICardApiData } from '../../constants/types';
import { Slider } from './productSlider';
export const Product = () => {
  // const sliders = [
  //   {
  //     image:
  //       'https://images.unsplash.com/photo-1682686578707-140b042e8f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1975&q=80',
  //   },
  //   {
  //     image:
  //       'https://images.unsplash.com/photo-1524309686920-ec0f7f2b1cc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2045&q=80',
  //   },
  //   {
  //     image:
  //       'https://images.unsplash.com/photo-1692736230146-cdfe68c69670?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
  //   },
  // ];
  const api = useContext(apiContext);
  const productAdapter = useMemo(() => new ProductAdapter(api), [api]);
  const [productData, setProductData] = useState<ICardApiData>({ image: '', name: '', description: '', price: '', id: '' });
  const [productsData, setProductsData] = useState<ICardApiData[]>([{ image: '', name: '', description: '', price: '', id: '' }]);
  const swiperHandler = async () => {
    const product2: ICardApiData = await productAdapter.getProductByKey({ key: 'nude', productVariant: true });
    console.log(product2);
    setProductData(product2);
  };
  useEffect(() => {
    const getData = async () => {
      const product1: ICardApiData = await productAdapter.getProductByKey({ key: 'nude' });
      const product2: ICardApiData = await productAdapter.getProductByKey({ key: 'nude', productVariant: true });
      console.log(product2);
      const products: ICardApiData[] = [product1, product2];
      setProductData(product1);
      setProductsData(products);
    };
    getData();
  }, [productAdapter]);
  return (
    <div className='product__container'>
      <Slider sliders={productsData} swiperHandler={swiperHandler} />
      <ProductInfo cardApiData={productData} />
    </div>
  );
};
