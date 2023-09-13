import { useCallback, useContext, useEffect, useState } from 'react';
import './basket.scss';
import { apiContext } from '../App';
import { HTTPResponseCode, RoutePath } from '../../constants/types';
import { SortParams } from '../../constants/apiClient/apiClientTypes';

interface IProduct {
  productId: string;
  lineItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | undefined;
}

export const Basket = () => {
  const api = useContext(apiContext);

  const [cart, setCart] = useState<IProduct[]>([]);
  const [emptyCart, setEmptyCart] = useState(true);
  const [total, setTotal] = useState(0);

  const loadCart = useCallback(async () => {
    const cart = await api.getCart();
    if (cart.statusCode === HTTPResponseCode.ok) {
      if (cart.body.lineItems.length > 0) {
        const items: IProduct[] = cart.body.lineItems.map((lineItem) => ({
          productId: lineItem.productId,
          lineItemId: lineItem.id,
          name: lineItem.name[SortParams.searchRU],
          price: Number(lineItem.price.value.centAmount) / 100, // cents to USD
          quantity: Number(lineItem.quantity),
          image: lineItem.variant.images?.[0].url,
        }));
        setCart(items);
        console.log(items);
        setTotal(cart.body.totalPrice.centAmount / 100); // cents to USD
        setEmptyCart(false);
      } else {
        setEmptyCart(true);
      }
    }
  }, [api]);

  const addItem = useCallback(
    async (id: string) => {
      try {
        await api.addProductToCart(id);
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

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <div className='basket'>
      <h1 className='basket__heading'>CART</h1>
      <button onClick={() => addItem('693bd86c-6500-41c2-aa99-d169f4026976')}>ADD TEST ITEM</button>
      {emptyCart ? (
        <div>
          <h1 className='basket__heading'>CART IS EMPTY</h1>
          <a href={`/${RoutePath.catalog}`}>GO TO CATALOG</a>
        </div>
      ) : (
        <div>
          <ul>
            {cart.map(({ productId, lineItemId, name, quantity, price, image }) => (
              <li key={`li-${productId}`}>
                {`Product: ${name}, amount: ${quantity}, price: ${price}`}
                <img style={{ width: '60px', height: '60px' }} src={image} />
                <button key={`buttonAdd-${productId}`} onClick={async () => await addItem(productId)}>
                  ADD
                </button>
                -
                <button key={`buttonRemove-${lineItemId}`} onClick={async () => await removeItem(lineItemId)}>
                  REMOVE
                </button>
                -
                <button key={`buttonRemoveAll-${lineItemId}`} onClick={async () => await removeItem(lineItemId, quantity)}>
                  REMOVEALL
                </button>
              </li>
            ))}
          </ul>
          <p>{`TOTAL: ${total}`}</p>
          <button onClick={async () => await clearCart()}>CLEAR CART</button>-
          <button onClick={async () => await api.recalculateCart()}>RECALCULATE</button>
        </div>
      )}
    </div>
  );
};
