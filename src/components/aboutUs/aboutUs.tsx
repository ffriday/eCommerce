import Bio from './bio';
import './aboutUs.scss';
const Aboutus = () => {
  return (
    <main className='container'>
      <section className='about-us'>
        <h2 className='about-us__heading'>Члены команды</h2>
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
