import './checkbox.scss';

interface ICheckbox {
  id: string;
  isSelected: boolean;
  title: string;
  className?: string;
  link?: {
    path: string;
    text: string;
  };
}

const checkbox = (props: ICheckbox) => {
  const linkClass = props.link ? 'checkbox__link' : 'checkbox__link--disable';
  return (
    <div className='checkbox__wrapper'>
      <input
        type='checkbox'
        id={props.id}
        defaultChecked={props.isSelected}
        data-testid='checkbox'
        className={props.className ? `checkbox ${props.className}` : 'checkbox'}
      />
      <label className='checkbox__label' htmlFor={props.id}>
        {' '}
        {props.title}
      </label>

      <a className={linkClass} href={props.link?.path ?? '#'}>
        {props.link?.text}
      </a>
    </div>
  );
};

export default checkbox;
