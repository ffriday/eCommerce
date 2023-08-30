import { useState, useEffect, useMemo, useContext } from 'react';
import './catalog.scss';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';
import { ICatalogApiData } from '../../constants/types';
import CatalogList from './catalogList';
export default function ProductCatalog() {
  const limit = 2;
  const startPage = 1;
  const [catalogData, setCatalogData] = useState<ICatalogApiData>({ products: [], totalCount: 0 });
  const [page, setPage] = useState<number>(startPage);

  const api = useContext(apiContext);
  const productAdapter = useMemo(() => new ProductAdapter(api), [api]);
  const getTotalPageCount = (totalCount: number | undefined): number => Math.ceil(totalCount ? totalCount / limit : 1);
  const nextButtonHandler = () => {
    const current: number = page;
    const nextPage: number = current + 1;
    const totalCount = catalogData.products ? getTotalPageCount(catalogData.totalCount) : 0;

    setPage(nextPage <= totalCount ? nextPage : current), [page, catalogData];
  };
  const prevButtonHandler = () => {
    const current: number = page;
    const prevPage: number = current - 1;
    setPage(prevPage > 0 ? prevPage : current), [page];
  };
  useEffect(() => {
    const getData = async () => {
      const offset: number = (page - 1) * limit;
      const catalogData: ICatalogApiData = await productAdapter.getCatalog({ limit: limit, offset: offset });
      setCatalogData(catalogData);
    };
    getData();
  }, [page]);

  return (
    <section className='catalog__section'>
      <div className='container'>
        <CatalogList catalogData={catalogData} />
        <nav className='catalog__navigation'>
          <button className='button catalog__button nav-button__left' onClick={prevButtonHandler} disabled={page === startPage}></button>
          <button
            className='button catalog__button nav-button__right'
            onClick={nextButtonHandler}
            disabled={page === getTotalPageCount(catalogData.totalCount)}></button>
        </nav>
      </div>
    </section>
  );
}