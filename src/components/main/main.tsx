import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiContext } from '../App';

import './main.scss';

export default function Main() {
  const api = useContext(apiContext);
  const [isLogged, setIsLogged] = useState(api.userData.isLogged);

  return (
    <div className='main'>
      <p className='main__info'>Главная страница находится в разработке. Для входа или регистрации испозуйте соответствующие кнопки</p>
      <div className='main__btn-box'>
        {isLogged ? (
          <button
            className='main__btn-reg'
            onClick={() => {
              api.logOutCustomer();
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
    </div>
  );
}
