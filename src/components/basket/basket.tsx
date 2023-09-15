import { useCallback, useContext, useEffect, useState } from 'react';
import './basket.scss';
import { apiContext } from '../App';
import { HTTPResponseCode, RoutePath } from '../../constants/types';
import { SortParams } from '../../constants/apiClient/apiClientTypes';
import { IBasketProduct } from '../../constants/types';
import { BasketProduct } from './basketProduct';
import { Link } from 'react-router-dom';
import InputForm from '../inputForm/inputForm';

export const Basket = () => {
  const api = useContext(apiContext);

  const [cart, setCart] = useState<IBasketProduct[]>([]);
  const [emptyCart, setEmptyCart] = useState(true);
  const [total, setTotal] = useState(0);
  const [promo, setPromo] = useState('');
  const [promoCodes, setPromoCodes] = useState([]);
  const [promoError, setPromoError] = useState('');

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
          quantity: Number(lineItem.quantity),
          image: lineItem.variant.images?.[0].url,
          variantId: lineItem.variant.id,
        }));
        setCart(items);
        setTotal(cart.body.totalPrice.centAmount / 100); // cents to USD
        setEmptyCart(false);
      } else {
        setEmptyCart(true);
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
    if (promo) {
      try {
        await api.addPromoCode(promo);
      } catch (err) {
        if (err instanceof Error) {
          setPromoError(err.message);
        }
      }
    }
  };
  const removePromo = async () => {
    null;
  };

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
            {cart.map(({ productId, lineItemId, name, quantity, price, image, variantId }) => (
              <BasketProduct
                key={lineItemId}
                productId={productId}
                lineItemId={lineItemId}
                name={name}
                quantity={quantity}
                price={price}
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
              <p>{`Стоимость товаров: ${total}$`}</p>
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
                handler={(event) => setPromo(event.currentTarget.value)}
              />
              <button className='basket__btn' onClick={addPromo}>
                Применить промокод
              </button>
            </div>
          </div>
          {promoError ? <span className='basket__errorMessage'>{promoError}</span> : null}
        </>
      )}
    </div>
  );
};
