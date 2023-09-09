// import { useState, useEffect, useMemo, useContext } from 'react';
import './card.scss';
import { ICardApiData } from '../../constants/types';
import { Link } from 'react-router-dom';
// import ProductAdapter from '../../constants/productAadapter';
// import { apiContext } from '../App';

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
  const data = cardApiData;
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
        <button className='card__button'>В корзину</button>
      </div>
    </Link>
  );
}
