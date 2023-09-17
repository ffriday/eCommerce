import FooterList from './footerList';
import { IFooterList } from './footerList';
import Logo from '../../assets/header/logo.svg';
import RSLogo from '../../assets/aboutus/rs-logo.svg';
import { Link } from 'react-router-dom';
import './footer.scss';
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
        <Link to='/' className='footer__logo'>
          <img className='footer__logo-img' src={Logo}></img>
        </Link>
        <a className='footer__rslogo' href='https://rs.school/'>
          <img className='footer__rslogo-img' src={RSLogo}></img>
        </a>
        <span className='footer__title'>© BLOSSOM 2023 by BugBusters</span>
        <div className='footer__list-wrapper'>
          <FooterList {...authors} />
          <FooterList {...mentors} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
