import { useContext, useEffect, useState, useCallback } from 'react';
import { ICardApiData } from '../../constants/types';
import { Link } from 'react-router-dom';
import { apiContext } from '../App';
import { HTTPResponseCode } from '../../constants/types';
import './card.scss';

interface IProductCard {
  cardApiData?: ICardApiData;
  link: string;
  discounted?: boolean;
}

export default function ProductCard({
  discounted,
  link,
  cardApiData = { image: '', name: '', description: '', price: '', id: '', key: '', isDiscounted: false, discPrice: '' },
}: IProductCard) {
  const api = useContext(apiContext);
  // const isInBusket = useCallback(async () => {
  //   const cart = await api.getCart();
  //   if (cart.statusCode === HTTPResponseCode.ok) {
  //     const itemInBusket = cart.body.lineItems.filter((lineItem) => lineItem.productId === data?.id);
  //     setInBusket(itemInBusket.length > 0);
  //   }
  // }, [api]);

  const [inBusket, setInBusket] = useState(false);
  // useEffect(() => {
  //   isInBusket();
  // }, []);

  const addItem = async (id: string, variantId: number) => {
    try {
      await api.addProductToCart(id, variantId);
    } catch (err) {
      throw new Error(`${err}`);
    }
  };
  const data = cardApiData;

  const addToBasketBtnHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await addItem(data.id, 2);
    setInBusket(!inBusket);
  };

  const disableClassName = discounted ? 'card__price--disable' : '';
  return (
    <Link to={link} className='card'>
      <img className='card__image' src={data?.image} alt='Product card' />
      <h2 className='card__heading'>{data?.name}</h2>
      <p className='card__description'>{data?.description}</p>
      <div className='card__bottom-box'>
        {' '}
        <div className='card__prices'>
          <span className={disableClassName}> {`${data?.price} USD/шт. `}</span>
          {discounted && <span className={'card__price card__price--discounted'}>{`${data?.discPrice} USD/шт. `}</span>}
        </div>
        <button disabled={inBusket} className='card__button' onClick={addToBasketBtnHandler}>
          В корзину
        </button>
      </div>
    </Link>
  );
}
