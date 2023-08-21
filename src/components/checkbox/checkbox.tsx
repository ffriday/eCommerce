import './checkbox.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ICheckbox {
  id: string;
  handler: () => void;
  title: string;
  className?: string;
  classNameWrapper?: string;
  link?: {
    path: string;
    text: string;
  };
}

const Checkbox = (props: ICheckbox) => {
  const linkClass = props.link ? 'checkbox__link' : 'disable';
  const [isSelected, setIsSelected] = useState(false);
  const action = () => {
    setIsSelected(!isSelected);
    props.handler();
  };

  return (
    <div className={`checkbox__wrapper  ${props.classNameWrapper ?? ''}`}>
      <input
        type='checkbox'
        id={props.id}
        onChange={action}
        defaultChecked={isSelected}
        data-testid='checkbox'
        className={`checkbox ${props.className ?? ''}`}
      />
      <label className='checkbox__label' htmlFor={props.id}>
        {props.title}
      </label>

      <Link className={linkClass} to='/registration'>
        {props.link?.text}
      </Link>
    </div>
  );
};

export default Checkbox;
