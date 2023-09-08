import { memo } from 'react';
import './catalog.scss';
import ProductCard from '../card/card';
import { ICatalogApiData } from '../../constants/types';

interface ICatalogList {
  catalogData: ICatalogApiData;
}

const CatalogList = ({ catalogData }: ICatalogList) => {
  return (
    <>
      {catalogData && (
        <div className='catalog__body'>
          {catalogData.products.map((item) => {
            return <ProductCard link={item.key || ''} cardApiData={item} key={item.id + Date.now() * Math.random()} />;
          })}
        </div>
      )}
    </>
  );
};
export default memo(CatalogList);
