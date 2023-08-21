import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '../Header';
import Notfound from '../404/404';
import LoginForm from '../loginForm/loginForm';
import RegisterForm from '../registerForm/registerForm';
import Main from '../main/main';
import './styles.scss';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/registration' element={<RegisterForm />} />
        <Route path='/*' element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}
