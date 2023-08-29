import { useState, useEffect } from 'react';
import './card.scss';
import { getProductsData } from '../../constants/getProductData';
interface IProductCard {
  discounted: boolean;
}

interface ICardApiData {
  image: string | undefined;
  name: string;
  description: string | undefined;
  price: number | '';
}

export default function ProductCard({ discounted }: IProductCard) {
  const [data, setData] = useState<ICardApiData>({ image: '', name: '', description: '', price: '' });
  useEffect(() => {
    const getData = async () => {
      const productData = (await getProductsData({ productId: '123a16a9-8959-42d4-909e-f0bd15d6898b' })) as ICardApiData;
      // for test using ID!!
      // const productData= await getProductsData({ productId: '123a16a9-8959-42d4-909e-f0bd15d6898b' }) as ICardApiData;

      // for test using catalog KEY!!
      // const catalogData= await getProductsData({ catalogKey: eCommerceEnv.CTP_PROJECT_KEY }) as ICardApiData[];
      // console.log(catalogData)
      setData(productData);
    };
    getData();
  }, []);
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
