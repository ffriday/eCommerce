// import { useState, useEffect, useMemo, useContext } from 'react';
import './card.scss';
import { ICardApiData } from '../../constants/types';
// import ProductAdapter from '../../constants/productAadapter';
// import { apiContext } from '../App';

interface IProductCard {
  cardApiData?: ICardApiData;
  discounted?: boolean;
}

export default function ProductCard({ discounted, cardApiData = { image: '', name: '', description: '', price: '', id: '' } }: IProductCard) {
  // const [data, setData] = useState<ICardApiData>(cardApiData);
  // const api = useContext(apiContext);
  // const productAdapter = useMemo(() => new ProductAdapter(api), [api]);
  // useEffect(() => {
  //   const getData = async () => {
  //     const productData = (await productAdapter.getProductById({
  //       id: '123a16a9-8959-42d4-909e-f0bd15d6898b',
  //       productVariant: 0,
  //     })) as ICardApiData;

  //     // for test using catalog KEY!!
  //     // const catalogData= await productAdapter.getCatalog({limit:8, offset:0}) as ICardApiData[];
  //     // console.log(catalogData);
  //     setData(productData);
  //   };
  //   getData();
  // },[]);
  const data = cardApiData;
  const disableClassName = discounted ? 'card__price--disable' : '';
  return (
    <div className='card'>
      <img className='card__image' src={data?.image} alt='Product card' />
      <h2 className='card__heading'>{data?.name}</h2>
      <p className='card__description'>{data?.description}</p>
      <div className='card__bottom-box'>
        {' '}
        <div className='card__prices'>
          <span className={disableClassName}> {`${data?.price} USD/шт. `}</span>
          {discounted && <span className={'card__price card__price--discounted'}>{`${data?.price} USD/шт. `}</span>}
        </div>
        <button className='card__button'>В корзину</button>
      </div>
    </div>
  );
}
