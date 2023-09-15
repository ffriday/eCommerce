import { useCallback, useContext, useEffect, useState } from 'react';
import './basket.scss';
import { apiContext } from '../App';
import { HTTPResponseCode, RoutePath } from '../../constants/types';
import { SortParams } from '../../constants/apiClient/apiClientTypes';
import { IBasketProduct } from '../../constants/types';
import { BasketProduct } from './basketProduct';
import { Link } from 'react-router-dom';
import InputForm from '../inputForm/inputForm';
import { DiscountCodeInfo } from '@commercetools/platform-sdk';
import { BasketPromo } from './basketPromo';

export const Basket = () => {
  const api = useContext(apiContext);

  const [cart, setCart] = useState<IBasketProduct[]>([]);
  const [emptyCart, setEmptyCart] = useState(true);
  const [total, setTotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [promo, setPromo] = useState('');
  const [activePromoCodes, setActivePromoCodes] = useState<DiscountCodeInfo[]>([]);
  const [promoError, setPromoError] = useState('');
  const [isPromoAdding, setIsPromoAdding] = useState(false);

  const [isAddingToBasket, setIsAddingToBasket] = useState(false);
  const loadCart = useCallback(async () => {
    const cart = await api.getCart();
    if (cart.statusCode === HTTPResponseCode.ok) {
      if (cart.body.lineItems.length > 0) {
        const items: IBasketProduct[] = cart.body.lineItems.map((lineItem) => ({
          productId: lineItem.productId,
          lineItemId: lineItem.id,
          name: lineItem.name[SortParams.searchRU],
          price: Number(lineItem.price.value.centAmount) / 100, // cents to USD
          isDiscounted: Boolean(lineItem.price.discounted?.discount.id),
          discountPrice: Number(lineItem.price.discounted?.value.centAmount) / 100,
          quantity: Number(lineItem.quantity),
          image: lineItem.variant.images?.[0].url,
          variantId: lineItem.variant.id,
        }));
        setCart(items);
        setDiscountedTotal(cart.body.totalPrice.centAmount / 100); // cents to USD
        setTotal(items.reduce((acc, item) => acc + item.price * item.quantity, 0)); // Calculate total price
        setEmptyCart(false);
      } else {
        setEmptyCart(true);
      }
      if (cart.body.discountCodes.length > 0) {
        setActivePromoCodes(cart.body.discountCodes);
      }
    }
  }, [api]);

  const addItem = useCallback(
    async (id: string, variantId: number) => {
      try {
        await api.addProductToCart(id, variantId);
        await loadCart();
      } catch (err) {
        throw new Error(`${err}`);
      }
    },
    [api, loadCart],
  );

  const removeItem = useCallback(
    async (id: string, quantity = 1) => {
      try {
        await api.removeProductFromCart(id, quantity);
        await loadCart();
      } catch (err) {
        throw new Error(`${err}`);
      }
    },
    [api, loadCart],
  );

  const clearCart = useCallback(async () => {
    try {
      await api.clearCart();
      await loadCart();
    } catch (err) {
      throw new Error(`${err}`);
    }
  }, [api, loadCart]);

  const clearCartHandler = async () => {
    if (!isAddingToBasket) {
      setIsAddingToBasket(true);
      try {
        await clearCart();
      } catch (err) {
        throw new Error(`${err}`);
      } finally {
        setIsAddingToBasket(false);
      }
    }
  };

  const recalculateHandler = async () => {
    if (!isAddingToBasket) {
      setIsAddingToBasket(true);
      try {
        await api.recalculateCart();
      } catch (err) {
        throw new Error(`${err}`);
      } finally {
        setIsAddingToBasket(false);
      }
    }
  };

  const addPromo = async () => {
    setPromoError('');
    if (promo && !isPromoAdding) {
      setIsPromoAdding(true);
      try {
        const {
          statusCode,
          body: { discountCodes },
        } = await api.addPromoCode(promo);
        if (statusCode === HTTPResponseCode.ok) {
          setActivePromoCodes(discountCodes);
        }
        setPromo('');
        await loadCart();
      } catch (err) {
        if (err instanceof Error) {
          setPromoError(err.message);
        }
      }
      setIsPromoAdding(false);
    }
  };

  const removePromo = async (id: string) => {
    try {
      const {
        statusCode,
        body: { discountCodes },
      } = await api.removePromoCode(id);
      if (statusCode === HTTPResponseCode.ok) {
        setActivePromoCodes(discountCodes);
      }
      await loadCart();
    } catch (err) {
      if (err instanceof Error) {
        setPromoError(err.message);
      }
    }
  };

  const setError = (error: string) => setPromoError(error);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <div className='basket container'>
      {emptyCart ? (
        <div className='basket__empty'>
          <h1 className='basket__heading'>Корзина пуста</h1>
          <Link className={'basket__btn-back'} to={`/${RoutePath.catalog}`}>
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <>
          <ul>
            {cart.map(({ productId, lineItemId, name, quantity, price, image, variantId, discountPrice, isDiscounted }) => (
              <BasketProduct
                key={lineItemId}
                productId={productId}
                lineItemId={lineItemId}
                name={name}
                quantity={quantity}
                price={price}
                discountPrice={discountPrice}
                isDiscounted={isDiscounted}
                image={image}
                variantId={variantId}
                addItem={addItem}
                removeItem={removeItem}
                removeAllItems={removeItem}
              />
            ))}
          </ul>
          <div className='basket__bottom-box'>
            <div className='basket__bottom-total'>
              <div className='basket__price'>
                <p>Стоимость товаров: </p>
                {discountedTotal < total && <p className='basket__price--discounted'>{discountedTotal}$ </p>}
                <p className={discountedTotal < total ? 'basket__price--disable' : ''}>{`${total}$`}</p>
              </div>
              <button className='basket__btn' onClick={recalculateHandler}>
                Пересчитать стоимость
              </button>
              <button className='basket__btn' onClick={clearCartHandler}>
                Очистить корзину
              </button>
            </div>
            <div className='basket__bottom-promo'>
              <InputForm
                name={'Промокод'}
                type={'text'}
                id={'promo'}
                placeholder={'Промокод'}
                value={promo}
                handler={(event) => setPromo(event.currentTarget.value)}
              />
              <button className='basket__btn' onClick={addPromo}>
                Применить промокод
              </button>
            </div>
          </div>
          {activePromoCodes.length > 0 &&
            activePromoCodes.map(({ discountCode: { id } }) => (
              <BasketPromo key={id} promocodeId={id} removeHandler={removePromo} errorHandler={setError} />
            ))}
          {promoError ? <span className='basket__errorMessage'>{promoError}</span> : null}
        </>
      )}
    </div>
  );
};
