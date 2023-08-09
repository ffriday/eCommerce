import { FC } from 'react';
import './submitButton.sass';

interface ISubmitButton {
  text: string,
  disabled: boolean,
  className?: string,
}

export const SubmitButton: FC<ISubmitButton> = ({ text, disabled, className }) => {
  const defaultClassName = 'submit__button';
  const classNames = className ? `${defaultClassName} ${className}` : defaultClassName;

  return (
    <button
      className={ classNames }
      type='submit'
      disabled={ disabled }>
      { text }
    </button>
  );
};