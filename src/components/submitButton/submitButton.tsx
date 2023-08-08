import { FC } from 'react';
import './submitButton.sass';

interface ISubmitButton {
  text: string,
  className?: string,
}

export const SubmitButton: FC<ISubmitButton> = ({ text, className }) => {
  const defaultClassName = 'submit__button';
  const classNames = className ? `${defaultClassName} ${className}` : defaultClassName;

  return (
    <button
      className={ classNames }
      type='submit'>
      { text }
    </button>
  );
};