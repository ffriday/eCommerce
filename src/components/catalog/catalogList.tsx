import { memo, useContext } from 'react';
import './catalog.scss';
import ProductCard from '../card/card';
import { ICatalogApiData } from '../../constants/types';
import { IMouthhandler } from '../../constants/types';
import { apiContext } from '../App';
interface ICatalogList {
  catalogData: ICatalogApiData;
  inBusket?: boolean;
  ids: string[];
}

const CatalogList = ({ catalogData, inBusket = false, ids }: ICatalogList) => {
  console.log(ids);
  return (
    <>
      {catalogData && (
        <div className='catalog__body'>
          {catalogData.products.map((item, index) => {
            return (
              <ProductCard
                link={item.key || ''}
                cardApiData={item}
                key={item.id + Date.now() * Math.random()}
                discounted={item.isDiscounted}
                inBusket={item.id === ids[index] ? !inBusket : inBusket}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
export default memo(CatalogList);
