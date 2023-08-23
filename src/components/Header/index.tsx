import './styles.scss';
import Logo from '../../assets/header/logo.svg';
import Profile from '../../assets/header/profile.svg';
import Market from '../../assets/header/makrket.svg';
import { FC, Fragment } from 'react';
import { IMenuLink, IRoute, IRouteClasses, IRouteDropDown } from '../../constants/types';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Header: FC = () => {
  const routeClassNames: IRouteClasses = {
    container: 'navigation__page',
    link: 'navigation__link',
  };

  const tabsClassNames: IRouteClasses = {
    container: 'tabs__tab',
    link: 'tabs__link',
  };

  const dropDownMenuClassNames: IRouteClasses = {
    container: 'tabs__tab navigation-mob__drop-down-link',
    link: 'tabs__link',
  };

  const routes: IRoute[] = [
    { title: 'Каталог', href: '/catalog', classNames: routeClassNames },
    { title: 'О нас', href: '/about', classNames: routeClassNames },
    { title: 'Контакты', href: '/contacts', classNames: routeClassNames },
  ];

  const tabs: IRoute[] = [
    { title: 'букеты', href: '/bouquets', classNames: tabsClassNames },
    { title: 'композиции', href: '/compositions', classNames: tabsClassNames },
    { title: 'подарочные наборы', href: '/gift-sets', classNames: tabsClassNames },
    { title: 'акции', href: '/shares', classNames: tabsClassNames },
    { title: 'новинки', href: '/novelties', classNames: tabsClassNames },
  ];

  const menuLinks: IMenuLink[] = [
    { title: 'профиль', href: '/login', alt: 'Profile icon', icon: Profile, classNames: { container: 'menu__item' } },
    { title: 'корзина', href: '/market', alt: 'Market icon', icon: Market, classNames: { container: 'menu__item' } },
  ];
  const [BurgerBtnActive, setBurgerBtnActive] = useState({ classname: '', isActive: false });
  const [DropDownMenuActive, setDropDownMenuActive] = useState({ classname: '', isActive: false });
  const [headerClassName, setHeaderClassName] = useState('');
  const [isWrapperActive, setIsWrapperActive] = useState(false);
  const [menuActive, setMenuActive] = useState(true);
  const handle = () => {
    setIsWrapperActive(false);
    setMenuActive(!menuActive);
    setDropDownMenuActive({ classname: '', isActive: false });
    setBurgerBtnActive({ classname: '', isActive: false });
    setHeaderClassName('');
  };
  const handleDropDownLogo = () => {
    if (DropDownMenuActive.isActive) {
      handle();
    }
  };

  const handleBurgerLink = () => {
    setIsWrapperActive(true);
    setHeaderClassName('navigation--rotate');
    setMenuActive(!menuActive);
    setBurgerBtnActive({ classname: 'navigation__burger--active', isActive: true });
    setDropDownMenuActive({ classname: 'navigation-mob--active', isActive: true });
    BurgerBtnActive.isActive && setDropDownMenuActive({ classname: '', isActive: false });
    BurgerBtnActive.isActive && setBurgerBtnActive({ classname: '', isActive: false });
    BurgerBtnActive.isActive && setHeaderClassName('');
  };
  const dropDownMenu: IRouteDropDown[] = [
    { title: 'Личный кабинет', href: '/login', classNames: dropDownMenuClassNames },
    { title: 'Каталог', href: '/catalog', classNames: dropDownMenuClassNames },
    { title: 'О нас', href: '/about', classNames: dropDownMenuClassNames },
    { title: 'Aкции', href: '/shares', classNames: dropDownMenuClassNames },
    { title: 'Новинки', href: '/novelties', classNames: dropDownMenuClassNames },
    { title: 'Контакты', href: '/contacts', classNames: dropDownMenuClassNames },
  ];
  return (
    <>
      {isWrapperActive && <div className='wrapper-header' onClick={handle}></div>}
      <header className='header' data-testid='header'>
        <div className='header__container container'>
          <div className='header__body'>
            <nav className={`header__navigation navigation ${headerClassName}`}>
              <ul className='navigation__pages'>
                {routes.map((route) => (
                  <Fragment key={route.title}>
                    <RouteLink {...route} />
                  </Fragment>
                ))}
              </ul>
              <button className={`navigation__burger ${BurgerBtnActive.classname}`} onClick={handleBurgerLink}></button>
              <Link to='/' className='navigation__logo'>
                <img src={Logo} alt='blosson logo' onClick={handleDropDownLogo} />
              </Link>
              {menuActive && (
                <ul className='navigation__menu menu'>
                  {menuLinks.map((option) => (
                    <Fragment key={option.title}>
                      <MenuLink {...option} />
                    </Fragment>
                  ))}
                </ul>
              )}
            </nav>
            <ul className='header__tabs tabs'>
              {tabs.map((route) => (
                <Fragment key={route.title}>
                  <RouteLink {...route} />
                </Fragment>
              ))}
            </ul>
          </div>
        </div>
        <nav className={`navigation-mob ${DropDownMenuActive.classname}`}>
          <ul className='navigation-mob__drop-down-menu drop-down-menu'>
            {dropDownMenu.map((route) => (
              <Fragment key={route.title}>
                <RouteLink {...route} onClickHandle={handle} />
              </Fragment>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
};

const RouteLink: FC<IRoute> = ({ title, href, classNames, onClickHandle }) => {
  return (
    <li className={classNames.container} key={title}>
      <Link to={href} className={classNames.link} onClick={onClickHandle}>
        {title}
      </Link>
    </li>
  );
};

const MenuLink: FC<IMenuLink> = ({ title, href, classNames, alt, icon }) => {
  return (
    <li className={classNames.container} key={title}>
      <Link to={href}>
        <img src={icon} alt={alt} />
      </Link>
    </li>
  );
};
