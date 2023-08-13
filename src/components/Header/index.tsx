import './styles.scss';
import Logo from '../../assets/header/logo.svg';
import Profile from '../../assets/header/profile.svg';
import Market from '../../assets/header/makrket.svg';
import { FC, Fragment } from 'react';
import { IMenuLink, IRoute, IRouteClasses } from '../../constants/types';

export const Header: FC = () => {
  const routeClassNames: IRouteClasses = {
    container: 'navigation__page',
    link: 'navigation__link',
  };

  const tabsClassNames: IRouteClasses = {
    container: 'tabs__tab',
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
    { title: 'профиль', href: '/profile', alt: 'Profile icon', icon: Profile, classNames: { container: 'menu__item' } },
    { title: 'корзина', href: '/market', alt: 'Market icon', icon: Market, classNames: { container: 'menu__item' } },
  ];

  return (
    <header className='header' data-testid='header'>
      <div className='header__container container'>
        <div className='header__body'>
          <nav className='header__navigation navigation'>
            <ul className='navigation__pages'>
              {routes.map((route) => (
                <Fragment key={route.title}>
                  <RouteLink {...route} />
                </Fragment>
              ))}
            </ul>
            <a href='/' className='navigation__logo'>
              <img src={Logo} alt='blosson logo' />
            </a>
            <ul className='navigation__menu menu'>
              {menuLinks.map((option) => (
                <Fragment key={option.title}>
                  <MenuLink {...option} />
                </Fragment>
              ))}
            </ul>
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
    </header>
  );
};

const RouteLink: FC<IRoute> = ({ title, href, classNames }) => {
  return (
    <li className={classNames.container} key={title}>
      <a href={href} className={classNames.link}>
        {title}
      </a>
    </li>
  );
};

const MenuLink: FC<IMenuLink> = ({ title, href, classNames, alt, icon }) => {
  return (
    <li className={classNames.container} key={title}>
      <a href={href}>
        <img src={icon} alt={alt} />
      </a>
    </li>
  );
};
