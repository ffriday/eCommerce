import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '../Header';
import Notfound from '../404/404';
import LoginForm from '../loginForm/loginForm';
import RegisterForm from '../registerForm/registerForm';
import Main from '../main/main';

import './styles.scss';
import { createContext } from 'react';
import ApiClient from '../../constants/apiClient/apiClient';
import { eCommerceEnv } from '../../constants/ecommerce.env';
import ProductCatalog from '../catalog/catalog';
import { CustomerProfile } from '../customerProfile/customerProfile';
import { Product } from '../product/product';
import { RoutePath } from '../../constants/types';
import ProductAdapter from '../../constants/productAadapter';

const api = new ApiClient(eCommerceEnv);
export const apiContext = createContext(api);
// const test = async () => {
//   console.log(api.categories);
//   const adapter = new ProductAdapter(api);
//   const res = await adapter.getCatalog({ limit: 20 }, { categoryId: api.categories.flowerarrangements });
// };

// const f = async () => {
//   const addr = await api.getProductFiltered({}, { currency: SortParams.USD, discount: true });
//   const addr = await api.getProductFiltered({}, { currency: SortParams.USD, discount: true });
//   console.log(addr);
// };

// const d = async (val: string) => {
//   const s = await api.getProductSearch({}, {keyword: val});
//   const res = (await Promise.all(s.map((val) => api.getProductFiltered({}, {searchKeywords: [val]})))).flat();
//   const arr: ProductProjection[] = [];
//   const res2 = res.forEach((val) => val.body.results.map(element => {if (!arr.includes(element)) arr.push(element);}));
//   const mySet = new Set(arr);
//   console.log(mySet);
// };

export default function App() {
  return (
    <apiContext.Provider value={api}>
      <BrowserRouter>
        <Header />
        {/* <button onClick={test}>click</button> */}
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path={`/${RoutePath.login}`} element={<LoginForm />} />
          <Route path={`/${RoutePath.register}`} element={<RegisterForm />} />
          <Route key='catalog' path={`/${RoutePath.catalog}`} element={<ProductCatalog />} />
          <Route
            path={`/${RoutePath.arrangmentcategory}`}
            element={<ProductCatalog key='catalog1' queryFilter={{ categoryId: '6537ef03-3ae8-4fad-a594-c1a5e2342131' }} />}
          />
          <Route
            path={`/${RoutePath.bouquetscategory}`}
            element={<ProductCatalog key='catalog2' queryFilter={{ categoryId: '66ce170c-bfbd-4fe0-b0c7-9826d8aba68e' }} />}
          />
          <Route
            path={`/${RoutePath.giftbasketcategory}`}
            element={<ProductCatalog key='catalog3' queryFilter={{ categoryId: 'ecb20a4c-70a3-43b8-abcb-8eb28b17bce7' }} />}
          />
          <Route path={`/${RoutePath.account}`} element={<CustomerProfile />} />
          <Route path={`/${RoutePath.product}`} element={<Product />} />
          <Route path='*' element={<Notfound />} />
        </Routes>
      </BrowserRouter>
      {/* <button onClick={f}>TEST</button> */}
      {/* <input onChange={(e) => d(e.currentTarget.value)} placeholder='test'/> */}
    </apiContext.Provider>
  );
}
