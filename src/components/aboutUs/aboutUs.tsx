import Bio from './bio';
import { mainDmitryInfo } from './aboutUsData';
import { mainRomanInfo } from './aboutUsData';
import { infoRoman } from './aboutUsData';
import { contributionRoman } from './aboutUsData';
import { difficultiesRoman } from './aboutUsData';
import { infoDmitry } from './aboutUsData';
import { contributionDmitry } from './aboutUsData';
import { difficultiesDmitry } from './aboutUsData';
import './aboutUs.scss';

const Aboutus = () => {
  return (
    <main className='container'>
      <section className='about-us'>
        <h2 className='about-us__heading'>Члены команды</h2>
        <Bio mainInfo={mainDmitryInfo} info={infoDmitry} contribution={contributionDmitry} difficulties={difficultiesDmitry} />
        <Bio mainInfo={mainRomanInfo} info={infoRoman} contribution={contributionRoman} difficulties={difficultiesRoman} />
      </section>
      <section className='about-us'>
        <h2 className='about-us__heading'>Сотрудничество</h2>
      </section>
      <section className='about-us'>
        <h2 className='about-us__heading'>Чтобы узнать больше и начать обучение в RS School переходи по ссылке ниже</h2>
      </section>
    </main>
  );
};

export default Aboutus;
