import { useState, useEffect, useMemo, useContext } from 'react';
import './catalog.scss';
import { ICardApiData } from '../../constants/types';
import ProductAdapter from '../../constants/productAadapter';
import { apiContext } from '../App';
import ProductCard from '../card/card';

// interface IProductCard {
//   cardApiData?: ICardApiData;
//   discounted?: boolean;
// }

export default function ProductCatalog() {
  const [data, setData] = useState<ICardApiData[]>([]);
  const api = useContext(apiContext);
  const productAdapter = useMemo(() => new ProductAdapter(api), [api]);
  useEffect(() => {
    const getData = async () => {
      const catalogData = (await productAdapter.getCatalog({ limit: 3, offset: 0 })) as ICardApiData[];
      // console.log(catalogData);
      // for test using catalog KEY!!
      // const catalogData= await productAdapter.getCatalog({limit:8, offset:0}) as ICardApiData[];
      // console.log(catalogData);
      setData(catalogData);
    };
    getData();
  });

  return (
    <div>
      {data.map((item) => {
        return <ProductCard cardApiData={item} key={new Date().getTime().toString()} />;
      })}
    </div>
  );
}
