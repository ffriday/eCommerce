import { IBasketProduct } from '../../constants/types';
import { BasketItemAddType } from '../../constants/types';
import { BasketItemRemoveType } from '../../constants/types';
import { BasketItemRemoveAllType } from '../../constants/types';
import { useState } from 'react';

interface IBasketProductComponent extends IBasketProduct {
  addItem: BasketItemAddType;
  removeItem: BasketItemRemoveType;
  removeAllItems: BasketItemRemoveAllType;
}
export const BasketProduct = ({
  productId,
  lineItemId,
  name,
  price,
  discountPrice,
  isDiscounted,
  quantity,
  image,
  variantId,
  addItem,
  removeItem,
  removeAllItems,
}: IBasketProductComponent) => {
  const [isAddingToBasket, setIsAddingToBasket] = useState(false);
  const [viewPrice, setViewPrice] = useState(price);
  const [viewDiscountPrice, setViewDiscountPrice] = useState(discountPrice);
  const priceClassName = isDiscounted ? 'basket__price basket__price--disable' : 'basket__price';
  const removeItemHandler = async () => {
    if (!isAddingToBasket) {
      setIsAddingToBasket(true);
      try {
        await removeItem(lineItemId);
        setViewPrice(quantity * price);
        isDiscounted && setViewDiscountPrice(quantity * discountPrice);
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
        await addItem(productId, variantId);
        setViewPrice(quantity * price);
        isDiscounted && setViewDiscountPrice(quantity * discountPrice);
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
        <div className='basket__price-box'>
          {isDiscounted && <div className='basket__price basket__price--discounted'>{viewDiscountPrice} $</div>}
          <div className={priceClassName}>{viewPrice} $</div>
        </div>
        <button className='basket__remove-all' onClick={removeAllItemHandler}></button>
      </div>
    </li>
  );
};
