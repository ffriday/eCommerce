import { memo } from 'react';
import './catalog.scss';
import { ICatalogApiData } from '../../constants/types';

interface ICatalogNavigation {
  catalogData: ICatalogApiData;
  page: number;
  limit: number;
  prevHandler: () => void;
  nextHandler: () => void;
}

const CatalogNavigation = ({ catalogData, page, limit, prevHandler, nextHandler }: ICatalogNavigation) => {
  const getTotalPageCount = (totalCount: number | undefined): number => Math.ceil(totalCount ? totalCount / limit : 1);
  const countOfPages: number = getTotalPageCount(catalogData.totalCount);
  const limitOfLabelElements = 4;
  const countOfLabelElements = countOfPages <= limitOfLabelElements ? countOfPages : limitOfLabelElements;
  const countOfLabel: number[] = new Array(countOfLabelElements).fill(1);
  const firstPage = 1;
  const labelPage: number = page <= limitOfLabelElements ? page : limitOfLabelElements;
  return (
    <nav className='catalog__navigation'>
      <button className='button catalog__button nav-button__left' onClick={prevHandler} disabled={page === firstPage}></button>
      {countOfLabel.map((item, index) => (
        <div className={`catalog__label ${labelPage === index + 1 ? 'catalog__label--active' : ''}`} key={index + item}></div>
      ))}
      <button className='button catalog__button nav-button__right' onClick={nextHandler} disabled={page === countOfPages}></button>
    </nav>
  );
};
export default memo(CatalogNavigation);
