import { useState, useEffect, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';

import ProductInfo from './productInfo';
import Modal from 'react-modal';
import { useMediaQuery } from '@react-hook/media-query';

import { ICardApiData } from '../../constants/types';
import { Slider } from './productSlider';
import './product.scss';
export const Product = () => {
  const { key } = useParams();
  const isSmallDevice = useMediaQuery('only screen and (max-width : 670px)');
  const demension = isSmallDevice ? '300px' : '600px';
  const api = useContext(apiContext);
  const productAdapter = useMemo(() => new ProductAdapter(api), [api]);

  const [isVariant, setIsVariant] = useState(false);
  const [productData, setProductData] = useState<ICardApiData | undefined>({ image: '', name: '', description: '', price: '', id: '', key: '' });
  const [productsData, setProductsData] = useState<ICardApiData[]>([{ image: '', name: '', description: '', price: '', id: '', key: '' }]);
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
      let product1: ICardApiData | undefined;
      let product2: ICardApiData | undefined;

      try {
        if (!key) {
          return;
        }

        product1 = await productAdapter.getProductByKey({ key });
        product2 = await productAdapter.getProductByKey({ key, productVariant: true });
      } catch (error) {
        product2 = undefined;
      }

      const products: ICardApiData[] = [];
      if (product1?.image) products.push(product1);
      if (product2?.image) products.push(product2);

      if (isVariant) {
        setProductData(product1);
      } else {
        setProductData(product2 || product1);
      }

      setProductsData(products);
    };
    getData();
  }, [productAdapter, isVariant, key]);
  return (
    <div className='product__container container'>
      <div className='slider__box'>
        {!modalIsOpen && isSmallDevice ? (
          <Slider sliders={productsData} swiperHandler={swiperHandler} clickHandler={openModal} />
        ) : (
          <Slider sliders={productsData} swiperHandler={swiperHandler} clickDoubleHandler={openModal} />
        )}
        {!isSmallDevice && <div className='slider__tooltip'>Двойным кликом можно изменить массштаб</div>}
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
            padding: '20px',
            overflow: 'hidden',
            position: 'absolute',
            margin: 'auto',
            zIndex: 20,
            background: 'rgba(0, 0, 0, 0)',
          },
        }}>
        {isSmallDevice ? (
          <Slider sliders={productsData} swiperHandler={swiperHandler} clickHandler={closeModal} />
        ) : (
          <Slider sliders={productsData} swiperHandler={swiperHandler} clickDoubleHandler={closeModal} />
        )}
      </Modal>
    </div>
  );
};
