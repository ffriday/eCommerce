import './card.scss';
import { jsonData } from './testData';

interface IProductCard {
  discounted: boolean;
}
const centAmount: number = jsonData.masterData.current.masterVariant.prices[0].value.centAmount;
const fractionDigits: number = jsonData.masterData.current.masterVariant.prices[0].value.fractionDigits;
const price: number = centAmount / 10 ** fractionDigits;
const image: string = jsonData.masterData.current.masterVariant.images[0].url;
const name: string = jsonData.masterData.current.name.en;
const description: string = jsonData.masterData.current.description.en;

export default function ProductCard({ discounted }: IProductCard) {
  const disableClassName = discounted ? 'card__price--disable' : '';
  const discountedClassName = discounted ? 'card__price--discounted' : '';
  return (
    <div className='card'>
      <img className='card__image' src={image} alt='Product card' />
      <h2 className='card__heading'>{name}</h2>
      <p className='card__description'>{description}</p>
      <div className='card__bottom-box'>
        {' '}
        <div className='card__prices'>
          <span className={`${disableClassName}`}> {`${price} USD/шт. `}</span>
          {discounted && <span className={`card__price ${discountedClassName}`}>{`${price} USD/шт. `}</span>}
        </div>
        <button className='card__button'>В корзину</button>
      </div>
    </div>
  );
}
