import { useState, useEffect, useMemo, useContext } from 'react';
import './catalog.scss';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';
import { ICatalogApiData } from '../../constants/types';
import CatalogList from './catalogList';
import CatalogNavigation from './catalogNavigation';
export default function ProductCatalog() {
  const limit = 2;
  const storedPage = localStorage.getItem('page');
  const startPage = storedPage ? Number(storedPage) : 1;
  const [catalogData, setCatalogData] = useState<ICatalogApiData>({ products: [], totalCount: 0 });
  const [page, setPage] = useState<number>(startPage);

  const api = useContext(apiContext);
  const productAdapter = useMemo(() => new ProductAdapter(api), [api]);
  const getTotalPageCount = (totalCount: number | undefined): number => Math.ceil(totalCount ? totalCount / limit : 1);
  const nextButtonHandler = () => {
    const current: number = page;
    const nextPage: number = current + 1;
    const totalCount = catalogData.products ? getTotalPageCount(catalogData.totalCount) : 0;
    const newPage = nextPage <= totalCount ? nextPage : current;
    localStorage.setItem('page', `${newPage}`);
    setPage(newPage), [page, catalogData];
  };
  const prevButtonHandler = () => {
    const current: number = page;
    const prevPage: number = current - 1;
    const newPage = prevPage > 0 ? prevPage : current;
    localStorage.setItem('page', `${newPage}`);
    setPage(prevPage > 0 ? prevPage : current), [page];
  };
  useEffect(() => {
    const getData = async () => {
      const offset: number = (page - 1) * limit;
      const catalogData: ICatalogApiData = await productAdapter.getCatalog({ limit: limit, offset: offset });
      setCatalogData(catalogData);
    };
    getData();
  }, [productAdapter, page]);

  return (
    <section className='catalog__section'>
      <div className='container'>
        <CatalogList catalogData={catalogData} />
        <CatalogNavigation
          catalogData={catalogData}
          startPage={startPage}
          page={page}
          limit={limit}
          prevHandler={prevButtonHandler}
          nextHandler={nextButtonHandler}
        />
      </div>
    </section>
  );
}
