import { FC } from 'react';
import './submitButton.scss';

interface ISubmitButton {
  text: string;
  disabled: boolean;
  className?: string;
  handler?: () => void;
}

const SubmitButton: FC<ISubmitButton> = ({ text, disabled, className, handler }) => {
  const defaultClassName = 'submit__button';
  const classNames = className ? `${defaultClassName} ${className}` : defaultClassName;

  return (
    <button
      className={classNames}
      type='submit'
      disabled={disabled}
      onClick={() => {
        if (handler) handler();
      }}>
      {text}
    </button>
  );
};

export default SubmitButton;
