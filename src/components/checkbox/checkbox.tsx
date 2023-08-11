import './checkbox.scss';
import { useState } from 'react';

interface ICheckbox {
  id: string;
  handler: () => void;
  isSelected: boolean;
  title: string;
  className?: string;
  link?: {
    path: string;
    text: string;
  };
}

const Checkbox = (props: ICheckbox) => {
  const linkClass = props.link ? 'checkbox__link' : 'checkbox__link--disable';
  const [state, setState] = useState(false);
  const action = () => {
    setState(!state);
    props.handler();
  };

  return (
    <div className='checkbox__wrapper'>
      <input
        type='checkbox'
        id={props.id}
        onChange={action}
        defaultChecked={props.isSelected}
        data-testid='checkbox'
        className={props.className ? `checkbox ${props.className}` : 'checkbox'}
      />
      <label className='checkbox__label' htmlFor={props.id}>
        {props.title}
      </label>

      <a className={linkClass} href={props.link?.path ?? '#'}>
        {props.link?.text}
      </a>
    </div>
  );
};

export default Checkbox;
