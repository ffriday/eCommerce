import './inputForm.scss';
import { useState } from 'react';

interface IInputForm {
  name: string;
  type: string;
  id: string;
  placeholder: string;
  action?: () => void;
  inputClassName?: string;
  labelClassName?: string;
  propLabelInfo?: string;
}
const InputForm = ({ name, type, id, placeholder, action, inputClassName = '', labelClassName = '', propLabelInfo = '' }: IInputForm) => {
  const defaultInputClass = 'inputForm';
  const defaultLabelClass = 'inputForm__label';
  const labelClass = `${defaultLabelClass} ${labelClassName ?? ''}`;
  const [labelInfo, setLabelInfo] = useState('');
  const handler: React.FormEventHandler<HTMLInputElement> = (event) => {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value) {
      setLabelInfo(propLabelInfo || placeholder);
    } else {
      setLabelInfo('');
    }
    if (action) {
      action();
    }
  };
  return (
    <div className='inputForm__wrapper'>
      <input
        type={type}
        id={id}
        className={inputClassName ? `${defaultInputClass} ${inputClassName}` : `${defaultInputClass}`}
        name={name}
        placeholder={placeholder}
        onInput={handler}
      />
      <label htmlFor={id} className={labelClass}>
        {labelInfo}
      </label>
    </div>
  );
};

export default InputForm;
