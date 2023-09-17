import FooterList from './footerList';
import { IFooterList } from './footerList';
const authors: IFooterList = {
  title: 'Авторы проекта:',
  firstName: 'Dmitry Bulgakov',
  firstNameLink: 'https://github.com/ffriday/',
  secondName: 'Roman Kadevich',
  secondNameLink: 'https://github.com/RomanKadevich',
};
const mentors: IFooterList = {
  title: 'Менторы проекта:',
  firstName: 'Vladimir Pekun',
  firstNameLink: 'https://github.com/Vight86',
  secondName: 'Anastasiya Nitsiyeuskaya',
  secondNameLink: 'https://github.com/anastasiya220394',
};
const Footer = () => {
  return (
    <div className='footer'>
      <div className='container footer__container'>
        <a className='footer__logo'>
          <img className='footer_logo-img'></img>
        </a>
        <a className='footer__rslogo'>
          <img className='footer_rslogo-img'></img>
        </a>
        <span className='footer__title'>© BLOSSOM 2023 by BugBusters</span>
        <FooterList {...authors} />
        <FooterList {...mentors} />
      </div>
    </div>
  );
};

export default Footer;
