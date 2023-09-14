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
      <button key={`buttonRemoveAll-${lineItemId}`} onClick={async () => await removeAllItems(lineItemId, quantity)}>
        REMOVEALL
      </button>
    </li>
  );
};
