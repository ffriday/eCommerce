import { useState, useEffect, useMemo, useContext } from 'react';
import './catalog.scss';
import { ICardApiData } from '../../constants/types';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';
import ProductCard from '../card/card';
import { ICatalogApiData } from '../../constants/types';

// interface IProductCard {
//   cardApiData?: ICardApiData;
//   discounted?: boolean;
// }

export default function ProductCatalog() {
  const limit = 4;
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
    const totalCount = catalogData.products ? getTotalPageCount(catalogData.totalCount) : 0;

    setPage(prevPage > 0 ? prevPage : current), [page];
  };
  useEffect(() => {
    const getData = async () => {
      const offset: number = (page - 1) * limit;
      const catalogData: ICatalogApiData = await productAdapter.getCatalog({ limit: limit, offset: offset });
      const totalCount: number | undefined = catalogData.totalCount;
      // console.log(catalogData);
      // for test using catalog KEY!!
      // const catalogData= await productAdapter.getCatalog({limit:8, offset:0}) as ICardApiData[];
      // console.log(catalogData);
      setCatalogData(catalogData);
    };
    getData();
  }, [page]);

  return (
    <section className='catalog__section'>
      <div className='container'>
        <div className='catalog__body'>
          {catalogData.products.map((item) => {
            return <ProductCard cardApiData={item} key={item.id} />;
          })}
        </div>
        <nav className='catalog__navigation'>
          <button className='button catalog__button nav-button__left'></button>
          <button className='button catalog__button nav-button__right'></button>
        </nav>
      </div>
    </section>
  );
}
