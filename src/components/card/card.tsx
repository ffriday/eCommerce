import { useState, useEffect } from 'react';
import './card.scss';
// import { jsonData } from './testData';
import ApiClient from '../../constants/apiClient';
import { eCommerceEnv } from '../../constants/ecommerce.env';
import { language } from '../../constants/types';
import { GetPrice } from '../../constants/types';
interface IProductCard {
  discounted: boolean;
}
// const centAmount: number = jsonData.masterData.current.masterVariant.prices[0].value.centAmount;
// const fractionDigits: number = jsonData.masterData.current.masterVariant.prices[0].value.fractionDigits;
// const price: number = centAmount / 10 ** fractionDigits;
// const image: string = jsonData.masterData.current.masterVariant.images[0].url;
// const name: string = jsonData.masterData.current.name.en;
// const description: string = jsonData.masterData.current.description.en;
const api = new ApiClient(eCommerceEnv);

interface ICardApiData {
  image: string | undefined;
  name: string;
  description: string | undefined;
  price: number | '';
}

const getPrice: GetPrice = (centAmount, fractionDigits) => {
  if (centAmount && fractionDigits) {
    return centAmount / 10 ** fractionDigits;
  }
  return '';
};

export default function ProductCard({ discounted }: IProductCard) {
  const [data, setData] = useState<ICardApiData | null>(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.getProducts({ key: eCommerceEnv.CTP_PROJECT_KEY });
        if (res.statusCode !== 200) {
          throw new Error(`Failed to fetch products. Status code: ${res.statusCode}`);
        }

        const data = res.body.results[5];
        const image: string | undefined = data.masterData.current.masterVariant.images?.[0]?.url;
        const name: string = data.masterData.current.name[language.ru];
        const description: string | undefined = data.masterData.current.description?.[language.ru];
        let price: number | '' = '';
        const priceData = data.masterData.current.masterVariant.prices;
        if (priceData && priceData.length > 0) {
          const centAmount: number | undefined = data.masterData.current.masterVariant.prices[0]?.value.centAmount;
          const fractionDigits: number | undefined = data.masterData.current.masterVariant.prices[0]?.value.fractionDigits;
          price = getPrice(centAmount, fractionDigits);
        }
        setData({
          image: image,
          name: name,
          description: description,
          price: price,
        });
      } catch (error) {
        const typedError = error as Error;
        throw typedError.message;
      }
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
