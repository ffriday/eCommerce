import { useState, useEffect, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';
import { HTTPResponseCode } from '../../constants/types';
import ProductInfo from './productInfo';
import Modal from 'react-modal';
import { useMediaQuery } from '@react-hook/media-query';

import { ICardApiData } from '../../constants/types';
import { Slider } from './productSlider';
import './product.scss';
const variantOfProduct1 = 1;
const variantOfProduct2 = 2;

export const Product = () => {
  const { key } = useParams();
  const isSmallDevice = useMediaQuery('only screen and (max-width : 670px)');
  const demension = isSmallDevice ? '300px' : '600px';
  const api = useContext(apiContext);
  const productAdapter = useMemo(() => new ProductAdapter(api), [api]);

  const [isVariant, setIsVariant] = useState(false);
  const [productData, setProductData] = useState<ICardApiData | undefined>({
    image: '',
    name: '',
    description: '',
    price: '',
    id: '',
    key: '',
    isDiscounted: false,
    discPrice: '',
  });
  const [productsData, setProductsData] = useState<ICardApiData[]>([
    { image: '', name: '', description: '', price: '', id: '', key: '', isDiscounted: false, discPrice: '' },
  ]);
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

  const [inBusketVar1, setInBusketVar1] = useState(false);
  const [inBusketVar2, setInBusketVar2] = useState(false);

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

  const addItem = async (id: string, variantId: number) => {
    try {
      await api.addProductToCart(id, variantId);
    } catch (err) {
      throw new Error(`${err}`);
    }
  };
  const addToBasketBtnHandler = async () => {
    if (productData) {
      try {
        await addItem(productData.id, isVariant ? variantOfProduct1 : variantOfProduct2);
        isInBusket();
      } catch (err) {
        throw new Error(`${err}`);
      }
    }
  };

  const getLineItemId = async () => {
    try {
      if (productData) {
        const res = await api.getCart();
        const lineId = res.body.lineItems.filter((item) => item.productId === productData.id)[0].id;
        const variant = res.body.lineItems.filter((item) => item.productId === productData.id)[0].variant.id;
        return { lineId, variant };
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  };
  const removeItem = async () => {
    try {
      const lineItemId = await getLineItemId();
      if (lineItemId?.lineId) {
        const variantIdToCheck = isVariant ? variantOfProduct1 : variantOfProduct2;
        await api.removeProductFromCart(lineItemId.lineId, variantIdToCheck);
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  };
  const removeFromBasketBtnHandler = async () => {
    if (productData) {
      try {
        await removeItem();
        isInBusket();
      } catch (err) {
        throw new Error(`${err}`);
      }
    }
  };
  const isInBusket = async () => {
    const cart = await api.getCart();
    if (cart.statusCode === HTTPResponseCode.ok) {
      let variantIdToCheck: number;
      if (isVariant) {
        variantIdToCheck = 1;
      } else {
        variantIdToCheck = 2;
      }

      const itemInBasket = cart.body.lineItems.filter(
        (lineItem) => lineItem.productId === productData?.id && lineItem.variant.id === variantIdToCheck,
      );

      const isInBasket = itemInBasket.length > 0;
      if (isVariant) {
        setInBusketVar1(isInBasket);
      } else {
        setInBusketVar2(isInBasket);
      }
    }
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [productAdapter, isVariant, key]);

  useEffect(() => {
    isInBusket();
    // eslint-disable-next-line
  }, [getData, isVariant]);
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

      {!modalIsOpen && (
        <ProductInfo
          isActiveLabelClass={isVariant}
          cardApiData={productData}
          discounted={productData?.isDiscounted}
          inBusket={isVariant ? inBusketVar1 : inBusketVar2}
          addToBasketBtnHandler={addToBasketBtnHandler}
          removeFromBasketBtnHandler={removeFromBasketBtnHandler}
        />
      )}
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
