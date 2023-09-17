export interface IFooterList {
  title: string;
  firstName: string;
  firstNameLink: string;
  secondName: string;
  secondNameLink: string;
}

const FooterList = (props: IFooterList) => {
  return (
    <ul className='footer__list'>
      <li className='footer__item footer__item-title'>{props.title}</li>
      <li className='footer__item'>
        <a href={props.firstNameLink} className='footer__item-link'>
          <span>{props.firstName}</span>
          <span className='footer__item-icon'></span>
        </a>
      </li>
      <li className='footer__item'>
        <a href={props.secondNameLink} className='footer__item-link'>
          <span>{props.secondName}</span>
          <span className='footer__item-icon'></span>
        </a>
      </li>
    </ul>
  );
};

export default FooterList;
