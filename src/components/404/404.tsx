import './404.scss';
import { Link } from 'react-router-dom';

export default function Notfound() {
  return (
    <div className='not-found'>
      <div className='not-found__img'></div>
      <div className='not-found__error'></div>
      <p className='not-found__info'>Упс, что-то пошло не так... Страница не найдена</p>
      <button className='not-found__button'>
        <Link to='/'>Вернуться на главную</Link>
      </button>
    </div>
  );
}
