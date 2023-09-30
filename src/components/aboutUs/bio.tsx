import { IBio } from '../../constants/types';

const Bio = ({ mainInfo, info, contribution, difficulties }: IBio) => {
  return (
    <div className='bio'>
      <ul className='bio__main bio__item'>
        <li className='bio__main-item'>
          <img className='bio__main-key bio__main-img' src={mainInfo.image} alt='фото' />
          <div className='bio__main-value'>{mainInfo.name}</div>
        </li>
        <li className='bio__main-item'>
          <div className='bio__main-key'>Роль:</div>
          <div className='bio__main-value'>{mainInfo.role}</div>
        </li>
        <li className='bio__main-item'>
          <div className='bio__main-key'>Пол:</div>
          <div className='bio__main-value'>{mainInfo.sex}</div>
        </li>
        <li className='bio__main-item'>
          <div className='bio__main-key'>Страна:</div>
          <div className='bio__main-value'>{mainInfo.country}</div>
        </li>
        <li className='bio__main-item'>
          <div className='bio__main-key'>Контакты:</div>
          <a className='bio__main-value bio__main-link' href={mainInfo.ghlink}>
            Ссылка на GitHub
          </a>
        </li>
      </ul>
      <div className='bio__info bio__item'>
        <div className='bio__heading-wrapper'>
          <span className='bio__icon bio__icon-info'></span>
          <h3 className='bio__heading bio__heading-info'>Краткая биография</h3>
        </div>
        <p className='bio__text'>{info}</p>
      </div>
      <div className='bio__contribution bio__item'>
        <div className='bio__heading-wrapper'>
          <span className='bio__icon bio__icon-contribution'></span>
          <h3 className='bio__heading bio__heading-contribution'>Вклад в проект</h3>
        </div>
        <p className='bio__text'>{contribution}</p>
      </div>
      <div className='bio__difficulties bio__item'>
        <div className='bio__heading-wrapper'>
          <span className='bio__icon bio__icon-difficulties'></span>
          <h3 className='bio__heading bio__heading-difficulties'>Трудности</h3>
        </div>
        <p className='bio__text'>{difficulties}</p>
      </div>
    </div>
  );
};

export default Bio;
