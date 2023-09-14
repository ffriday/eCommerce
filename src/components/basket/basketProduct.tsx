import { IBasketProduct } from '../../constants/types';
import { BasketItemAddOrRemType } from '../../constants/types';
import { BasketItemRemoveAllType } from '../../constants/types';

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
          <button className='basket__remove' onClick={async () => await removeItem(lineItemId)}></button>
          <div className='basket__count'>{quantity}</div>

          <button className='basket__add' onClick={async () => await addItem(productId)}></button>
        </div>
        <div className='basket__price'>{price} $/шт.</div>
        <button className='basket__remove-all' onClick={async () => await removeAllItems(lineItemId, quantity)}></button>
      </div>
    </li>
  );
};
