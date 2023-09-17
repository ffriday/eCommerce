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
        <span>{props.firstName}</span>
        <a className='footer__item-link' href={props.firstNameLink}></a>
      </li>
      <li className='footer__item'>
        <span>{props.secondName}</span>
        <a className='footer__item-link' href={props.secondNameLink}></a>
      </li>
    </ul>
  );
};

export default FooterList;
