import { useState, useEffect, useMemo, useContext } from 'react';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';
import './product.scss';
import ProductInfo from './productInfo';
import Modal from 'react-modal';
import { useMediaQuery } from '@react-hook/media-query';

import { ICardApiData } from '../../constants/types';
import { Slider } from './productSlider';
export const Product = () => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 670px)');
  const demension = isSmallDevice ? '300px' : '600px';
  const api = useContext(apiContext);
  const productAdapter = useMemo(() => new ProductAdapter(api), [api]);

  const [isVariant, setIsVariant] = useState(false);
  const [productData, setProductData] = useState<ICardApiData>({ image: '', name: '', description: '', price: '', id: '' });
  const [productsData, setProductsData] = useState<ICardApiData[]>([{ image: '', name: '', description: '', price: '', id: '' }]);
  const swiperHandler = async () => {
    setIsVariant(!isVariant);
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
    <div className='product__container container'>
      <div className='slider__box'>
        {' '}
        {!modalIsOpen && <Slider sliders={productsData} swiperHandler={swiperHandler} clickHandler={openModal} />}{' '}
        <div className='slider__tooltip'>Двойным кликом можно изменить массштаб</div>
      </div>

      {!modalIsOpen && <ProductInfo isActiveLabelClass={isVariant} cardApiData={productData} />}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 19,
          },
          content: {
            width: `${demension}`,
            height: `${demension}`,
            border: '0',
            padding: '0',
            overflow: 'hidden',
            position: 'absolute',
            margin: 'auto',
            zIndex: 20,
          },
        }}>
        <Slider sliders={productsData} swiperHandler={swiperHandler} clickHandler={closeModal} />
      </Modal>
    </div>
  );
};
