import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Notfound from '../404/404';
import LoginForm from '../loginForm/loginForm';
import RegisterForm from '../registerForm/registerForm';
import Main from '../main/main';
import Aboutus from '../aboutUs/aboutUs';
import './styles.scss';
import { createContext, useState } from 'react';
import ApiClient from '../../constants/apiClient/apiClient';
import { eCommerceEnv } from '../../constants/ecommerce.env';
import ProductCatalog from '../catalog/catalog';
import { CustomerProfile } from '../customerProfile/customerProfile';
import { Product } from '../product/product';
import { RoutePath } from '../../constants/types';
import Layout from '../Layout/Layout';
import { Basket } from '../basket/basket';
import { BasketContext } from '../../constants/types';

export const basketCounterContext = createContext<BasketContext>({
  basketCounter: 0,
  setBasketCounter: (count: number) => {
    count;
  },
});

const api = new ApiClient(eCommerceEnv);
export const apiContext = createContext(api);

export default function App() {
  const [basketCounter, setBasketCounter] = useState(0);

  return (
    <basketCounterContext.Provider value={{ basketCounter, setBasketCounter }}>
      <apiContext.Provider value={api}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Main />} />
              <Route path={`/${RoutePath.login}`} element={<LoginForm />} />
              <Route path={`/${RoutePath.register}`} element={<RegisterForm />} />
              <Route key='catalog' path={`/${RoutePath.catalog}`} element={<ProductCatalog />} />
              <Route path={`/${RoutePath.basket}`} element={<Basket />} />
              <Route path={`/${RoutePath.about}`} element={<Aboutus />} />
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
              <Route key='product' path={`/${RoutePath.product}`} element={<Product />} />
              <Route key='product1' path={`/${RoutePath.arrangmentcategoryprod}`} element={<Product />} />
              <Route key='product2' path={`/${RoutePath.bouquetscategoryprod}`} element={<Product />} />
              <Route key='product3' path={`/${RoutePath.giftbasketcategoryprod}`} element={<Product />} />
              <Route path='*' element={<Notfound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </apiContext.Provider>
    </basketCounterContext.Provider>
  );
}
