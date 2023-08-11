import './inputForm.scss';
import { useState } from 'react';

interface IInputForm {
  name: string;
  type: string;
  id: string;
  placeholder: string;
  inputClassName?: string;
  labelClassName?: string;
  labelInfo?: string;
}

const InputForm = (props: IInputForm) => {
  const defaultInputClass = 'inputForm';
  const defaultLabelClass = 'inputForm__label';
  const labelClass = props.labelClassName ? `${defaultLabelClass} ${props.labelClassName}` : `${defaultLabelClass}`;
  const [labelInfo, setLabelInfo] = useState('');
  const handler: React.FormEventHandler<HTMLInputElement> = (event) => {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value) {
      setLabelInfo(props.labelInfo || props.placeholder);
    } else {
      setLabelInfo('');
    }
  };
  return (
    <div className='inputForm__wrapper'>
      <input
        type={props.type}
        id={props.id}
        className={props.inputClassName ? `${defaultInputClass} ${props.inputClassName}` : `${defaultInputClass}`}
        name={props.name}
        placeholder={props.placeholder}
        onInput={handler}
      />
      <label htmlFor={props.id} className={`${labelClass}`}>{`${labelInfo}`}</label>
    </div>
  );
};

export default InputForm;
