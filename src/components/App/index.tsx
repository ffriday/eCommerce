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
// import { SortParams } from '../../constants/apiClient/apiClientTypes';
// import { ProductProjection } from '@commercetools/platform-sdk';

const api = new ApiClient(eCommerceEnv);
export const apiContext = createContext(api);

// const f = async () => {
//   // api.editCustomer({ name: 'ROMAN-1', surename: 'KADEVICH-1', birthDate: '2000-10-21', email: 'fuu@bar.buzz' });
//   // api.changePassword('qweQWE123!@#', '123!@#qweQWE');
//   const buketID = api.categories['bouquets'];
//   const res = api.getProductFiltered({ limit: 10 }, { categoryId: buketID, sortName: SortParams.descending, discount: true });
//   console.log(res);
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
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/registration' element={<RegisterForm />} />
          <Route path='/catalog' element={<ProductCatalog />} />
          <Route path='*' element={<Notfound />} />
        </Routes>
      </BrowserRouter>
      {/* <button onClick={f}>TEST</button>
      <input onChange={(e) => d(e.currentTarget.value)} placeholder='test'/> */}
    </apiContext.Provider>
  );
}
