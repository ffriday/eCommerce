import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '../Header';
import Notfound from '../404/404';
import LoginForm from '../loginForm/loginForm';
import RegisterForm from '../registerForm/registerForm';
import Main from '../main/main';
import './styles.scss';
import { createContext } from 'react';
import ApiClient from '../../constants/apiClient';
import { eCommerceEnv } from '../../constants/ecommerce.env';

const api = new ApiClient(eCommerceEnv);
export const apiContext = createContext(api);

export default function App() {
  return (
    <apiContext.Provider value={api}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/registration' element={<RegisterForm />} />
          <Route path='*' element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </apiContext.Provider>
  );
}
