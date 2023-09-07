import { FC, useState } from 'react';
import './sliderButton.scss';

interface ISliderButton {
  text: { first: string; second: string };
  handler: () => void;
  firstStep?: boolean;
  className?: string;
}

const SliderButton: FC<ISliderButton> = ({ text, handler, firstStep = true, className }) => {
  const defaultClassName = 'slider__button';
  const activeClassName = 'active';
  const classNames = className ? `${defaultClassName} ${className}` : defaultClassName;
  const [isFirstState, setIsFirstState] = useState(firstStep);

  const action = () => {
    setIsFirstState(!isFirstState);
    handler();
  };

  return (
    <div className={classNames} onClick={action}>
      <div className={isFirstState ? activeClassName : ''}>{text.first}</div>
      <div className={!isFirstState ? activeClassName : ''}>{text.second}</div>
    </div>
  );
};

export default SliderButton;
