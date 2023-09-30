import './styles.scss';
import Logo from '../../assets/header/logo.svg';
import Profile from '../../assets/header/profile.svg';
import Market from '../../assets/header/makrket.svg';
import { FC, Fragment } from 'react';
import { IMenuLink, IRoute, IRouteClasses, IRouteDropDown } from '../../constants/types';
import { HTTPResponseCode, RoutePath } from '../../constants/types';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { apiContext } from '../App';
import { basketCounterContext } from '../App';
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
  { title: 'Каталог', href: `/${RoutePath.catalog}`, classNames: routeClassNames },
  { title: 'О нас', href: `/${RoutePath.about}`, classNames: routeClassNames },
];

const tabs: IRoute[] = [
  { title: 'букеты', href: `/${RoutePath.bouquetscategory}`, classNames: tabsClassNames },
  { title: 'композиции', href: `/${RoutePath.arrangmentcategory}`, classNames: tabsClassNames },
  { title: 'подарочные наборы', href: `/${RoutePath.giftbasketcategory}`, classNames: tabsClassNames },
];

export const Header: FC = () => {
  const api = useContext(apiContext);
  const { basketCounter, setBasketCounter } = useContext(basketCounterContext);
  const [BurgerBtnActive, setBurgerBtnActive] = useState({ classname: '', isActive: false });
  const [DropDownMenuActive, setDropDownMenuActive] = useState({ classname: '', isActive: false });
  const [headerClassName, setHeaderClassName] = useState('');
  const [isWrapperActive, setIsWrapperActive] = useState(false);
  const [menuActive, setMenuActive] = useState(true);
  const [productCounter, setProductCounter] = useState(0);
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

  useEffect(() => {
    const getCountOfProductInBasket = async () => {
      const cart = await api.getCart();
      if (cart.statusCode === HTTPResponseCode.ok) {
        setProductCounter(cart.body.lineItems.length);
      }
    };

    getCountOfProductInBasket();
  }, [api, basketCounter, setBasketCounter]);
  const menuLinks: IMenuLink[] = [
    { title: 'профиль', href: `/${RoutePath.login}`, alt: 'Profile icon', icon: Profile, classNames: { container: 'menu__item' } },
    {
      title: 'корзина',
      href: `/${RoutePath.basket}`,
      alt: 'Market icon',
      icon: Market,
      classNames: { container: 'menu__item' },
      productCounter,
    },
  ];
  const handleBurgerLink = () => {
    setIsWrapperActive(true);
    setHeaderClassName('navigation--rotate');
    setMenuActive(!menuActive);
    setBurgerBtnActive({ classname: 'navigation__burger--active', isActive: true });
    setDropDownMenuActive({ classname: 'navigation-mob--active', isActive: true });
    BurgerBtnActive.isActive && setDropDownMenuActive({ classname: '', isActive: false });
    BurgerBtnActive.isActive && setBurgerBtnActive({ classname: '', isActive: false });
    BurgerBtnActive.isActive && setHeaderClassName('');
    BurgerBtnActive.isActive && setIsWrapperActive(false);
  };
  const dropDownMenu: IRouteDropDown[] = [
    { title: 'Личный кабинет', href: `/${RoutePath.login}`, classNames: dropDownMenuClassNames },
    { title: 'Каталог', href: `/${RoutePath.catalog}`, classNames: dropDownMenuClassNames },
    { title: 'О нас', href: `/${RoutePath.about}`, classNames: dropDownMenuClassNames },
    // { title: 'Aкции', href: `/${RoutePath.shares}`, classNames: dropDownMenuClassNames },
    // { title: 'Новинки', href: `/${RoutePath.novelties}`, classNames: dropDownMenuClassNames },
    // { title: 'Контакты', href: `/${RoutePath.contacts}`, classNames: dropDownMenuClassNames },
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

const MenuLink: FC<IMenuLink> = ({ title, href, classNames, alt, icon, productCounter }) => {
  return (
    <li className={classNames.container} key={title}>
      <Link to={href}>
        <img src={icon} alt={alt} />
        {productCounter !== 0 && <span>{productCounter}</span>}
      </Link>
    </li>
  );
};
