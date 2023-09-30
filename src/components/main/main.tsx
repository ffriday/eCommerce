import { useNavigate } from 'react-router';
import './main.scss';
import { Promocodes } from './promoCodes';

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className='main'>
      <section className='caption'>
        <h2>Найдите идеальный выбор для любого случая</h2>
        <h3>Прикасайтесь к</h3>
        <h3>красоте природы</h3>
        <h3>каждый день</h3>
        <button className='caption__btn-catalog' onClick={() => navigate('/catalog')}>
          Выбрать букет
        </button>
      </section>
      <Promocodes />
    </div>
  );
}
