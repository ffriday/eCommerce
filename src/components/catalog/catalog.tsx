import { useState, useEffect, useMemo, useContext } from 'react';
import './catalog.scss';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';
import { ICatalogApiData } from '../../constants/types';
import CatalogList from './catalogList';
import CatalogNavigation from './catalogNavigation';
import { useMediaQuery } from '@react-hook/media-query';
import { IProductFilter } from '../../constants/apiClient/apiClientTypes';
interface ICatalog {
  queryFilter?: Partial<IProductFilter> | undefined;
}
export default function ProductCatalog({ queryFilter }: ICatalog) {
  const isMediumDevice = useMediaQuery('only screen and (min-width: 503px) and (max-width: 800px)');
  const isSmallDevice = useMediaQuery('only screen and (max-width : 502px)');
  const mobileLimit = 2;
  const mediumLimit = 4;
  const desktopLimit = 8;
  const limit = isMediumDevice ? mediumLimit : isSmallDevice ? mobileLimit : desktopLimit;

  const startPage = 1;

  // const storedPage = localStorage.getItem('page');
  // const startPage = storedPage ? Number(storedPage) : 1;
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
    // localStorage.setItem('page', `${newPage}`);
    setPage(newPage);
  };
  const prevButtonHandler = () => {
    const current: number = page;
    const prevPage: number = current - 1;
    const newPage = prevPage > 0 ? prevPage : current;
    // localStorage.setItem('page', `${newPage}`);
    setPage(newPage);
  };

  useEffect(() => {
    const getData = async () => {
      const offset: number = (page - 1) * limit;
      const catalogData: ICatalogApiData = await productAdapter.getCatalog({ limit: limit, offset: offset }, queryFilter);
      setCatalogData(catalogData);
    };
    getData();
  }, [productAdapter, page, limit]);

  return (
    <section className='catalog__section'>
      <div className='container'>
        <CatalogList catalogData={catalogData} />
        {
          <CatalogNavigation
            catalogData={catalogData}
            page={page}
            limit={limit}
            prevHandler={prevButtonHandler}
            nextHandler={nextButtonHandler}
          />
        }
      </div>
    </section>
  );
}
