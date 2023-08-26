import { useState } from 'react';
import './main.scss';
import { Link } from 'react-router-dom';
import ProductCard from '../card/card';

export default function Main() {
  const [isLogged, setIsLogged] = useState(Boolean(window.localStorage.getItem('customerID')));

  return (
    <div className='main'>
      <p className='main__info'>Главная страница находится в разработке. Для входа или регистрации испозуйте соответствующие кнопки</p>
      <div className='main__btn-box'>
        {isLogged ? (
          <button
            className='main__btn-reg'
            onClick={() => {
              window.localStorage.setItem('customerID', '');
              setIsLogged(!isLogged);
            }}>
            Разлогиниться
          </button>
        ) : (
          <>
            <Link className='main__btn-login' to='/login'>
              Вход
            </Link>
            <Link className='main__btn-reg' to='/registration'>
              Регистрация
            </Link>
          </>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        {' '}
        <ProductCard discounted={false} />
        <ProductCard discounted={true} />
      </div>
    </div>
  );
}
