import { FC, useState } from 'react';
import './sliderButton.scss';

interface ISliderButton {
  text: {first: string, second: string},
  firstStep: boolean,
  handler: () => void,
  className?: string,
}

const SliderButton: FC<ISliderButton> = ({ text, firstStep, handler, className }) => {
  const defaultClassName = 'slider__button';
  const activeClassName = 'active';
  const classNames = className ? `${defaultClassName} ${className}` : defaultClassName;
  const [state, setState] = useState(firstStep);

  const action = () => {
    setState(!state);
    handler();
  };

  return (
    <div className={ classNames } onClick={action}>
      <div className={ state ? activeClassName : '' }>{ text.first }</div>
      <div className={ !state ? activeClassName : '' }>{ text.second }</div>
    </div>
  );
};

export default SliderButton;