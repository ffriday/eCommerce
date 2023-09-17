import Bio from './bio';
import { mainDmitryInfo } from './aboutUsData';
import { mainRomanInfo } from './aboutUsData';
import { infoRoman } from './aboutUsData';
import { contributionRoman } from './aboutUsData';
import { difficultiesRoman } from './aboutUsData';
import { infoDmitry } from './aboutUsData';
import { contributionDmitry } from './aboutUsData';
import { difficultiesDmitry } from './aboutUsData';
import { cooperation } from './aboutUsData';
import rsLogo from '../../assets/aboutus/rs-logo.svg';
import rsImg from '../../assets/aboutus/rs-img.png';
import FadeInOnScroll from './fadeScrool';
import './aboutUs.scss';

const Aboutus = () => {
  return (
    <main className='container'>
      <section className='about-us'>
        <FadeInOnScroll fromLeft={true}>
          <h2 className='about-us__heading'>Члены команды</h2>{' '}
        </FadeInOnScroll>

        <FadeInOnScroll>
          <Bio mainInfo={mainDmitryInfo} info={infoDmitry} contribution={contributionDmitry} difficulties={difficultiesDmitry} />
        </FadeInOnScroll>
        <FadeInOnScroll fromLeft={true}>
          <Bio mainInfo={mainRomanInfo} info={infoRoman} contribution={contributionRoman} difficulties={difficultiesRoman} />
        </FadeInOnScroll>
      </section>
      <section className='about-us'>
        <FadeInOnScroll>
          <h2 className='about-us__heading'>Сотрудничество</h2>
        </FadeInOnScroll>
        <FadeInOnScroll fromLeft={true}>
          {' '}
          <div className='about-us__cooperation'>{cooperation}</div>
        </FadeInOnScroll>
      </section>
      <section className='about-us'>
        <FadeInOnScroll>
          <h2 className='about-us__heading'>Чтобы узнать больше и начать обучение в RS School переходи по ссылкам ниже</h2>
        </FadeInOnScroll>
        <FadeInOnScroll fromLeft={true}>
          <div className='about-us__rs'>
            <a className='about-us__rs-logo-link' href=''>
              <img className='about-us__rs-logo' src={rsLogo} alt='RS-school' />
            </a>
            <a className='about-us__rs-img-link' href=''>
              <img className='about-us__rs-img' src={rsImg} alt='RS-school image' />
            </a>
          </div>
        </FadeInOnScroll>
      </section>
    </main>
  );
};

export default Aboutus;
