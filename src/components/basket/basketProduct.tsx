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
  addItem,
  removeItem,
  removeAllItems,
}: IBasketProductComponent) => {
  return (
    <li className='basket__item'>
      <img src={image} alt={`image:${name}`} className='basket__image'></img>
      <h3 className='basket__name'>{name}</h3>
      <div className='basket__variant-s'></div>
      <div className='basket__variant-m'></div>
      <div className='basket__control-box'>
        <button className='basket__remove' onClick={async () => await removeItem(lineItemId)}>
          -
        </button>
        <div className='basket__count'>{quantity}</div>
        <button className='basket__add' onClick={async () => await addItem(productId)}>
          +
        </button>
      </div>
      <div className='basket__price'>{price}</div>
      <div className='basket__remove-all' onClick={async () => await removeAllItems(lineItemId, quantity)}></div>
    </li>
  );
};
