import { IBasketProduct } from '../../constants/types';
import { BasketItemAddOrRemType } from '../../constants/types';
import { BasketItemRemoveAllType } from '../../constants/types';
import { useState } from 'react';

interface IBasketProductComponent extends IBasketProduct {
  addItem: BasketItemAddOrRemType;
  removeItem: BasketItemAddOrRemType;
  removeAllItems: BasketItemRemoveAllType;
}
export const BasketProduct = ({
  productId,
  lineItemId,
  name,
  price,
  quantity,
  image,
  variantId,
  addItem,
  removeItem,
  removeAllItems,
}: IBasketProductComponent) => {
  const [isAddingToBasket, setIsAddingToBasket] = useState(false);
  const removeItemHandler = async () => {
    if (!isAddingToBasket) {
      setIsAddingToBasket(true);
      try {
        await removeItem(lineItemId);
      } catch (err) {
        throw new Error(`${err}`);
      } finally {
        setIsAddingToBasket(false);
      }
    }
  };
  const addItemHandler = async () => {
    if (!isAddingToBasket) {
      setIsAddingToBasket(true);
      try {
        await addItem(productId);
      } catch (err) {
        throw new Error(`${err}`);
      } finally {
        setIsAddingToBasket(false);
      }
    }
  };
  const removeAllItemHandler = async () => {
    if (!isAddingToBasket) {
      setIsAddingToBasket(true);
      try {
        await removeAllItems(lineItemId, quantity);
      } catch (err) {
        throw new Error(`${err}`);
      } finally {
        setIsAddingToBasket(false);
      }
    }
  };
  return (
    <li className='basket__item'>
      <div className='basket__left-block'>
        <img src={image} alt={`image:${name}`} className='basket__image'></img>
        <h3 className='basket__name'>{name}</h3>
        {variantId === 1 ? (
          <div className='basket__variant'>S</div>
        ) : variantId === 2 ? (
          <div className='basket__variant'>M</div>
        ) : (
          <div>нет вариантов</div>
        )}
      </div>
      <div className='basket__right-block'>
        <div className='basket__control-box'>
          <button className='basket__remove' onClick={removeItemHandler}></button>
          <div className='basket__count'>{quantity}</div>

          <button className='basket__add' onClick={addItemHandler}></button>
        </div>
        <div className='basket__price'>{price} $/шт.</div>
        <button className='basket__remove-all' onClick={removeAllItemHandler}></button>
      </div>
    </li>
  );
};
