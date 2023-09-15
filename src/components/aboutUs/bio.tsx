import { IBio } from '../../constants/types';
const Bio = ({ mainInfo, info, contribution, difficulties }: IBio) => {
  return (
    <div className='bio'>
      <div className='bio__main bio__item'>img</div>
      <div className='bio__info bio__item'>
        <h3 className='bio__heading bio__heading-info'></h3>
        <p className='bio__text'>{info}</p>
      </div>
      <div className='bio__contribution bio__item'>
        <h3 className='bio__heading bio__heading-contribution'></h3>
        <p className='bio__text'>{contribution}</p>
      </div>
      <div className='bio__difficulties bio__item'>
        <h3 className='bio__heading bio__heading-difficulties'></h3>
        <p className='bio__text'>{difficulties}</p>
      </div>
    </div>
  );
};

export default Bio;
