import './inputForm.scss';
import { IInputhandler } from '../../constants/types';

interface IInputForm {
  name: string;
  type: string;
  id: string;
  placeholder: string;
  handler?: IInputhandler;
  value?: string | number;
  inputClassName?: string;
  labelClassName?: string;
  propLabelInfo?: string;
}
const InputForm = ({
  name,
  type,
  id,
  placeholder,
  handler,
  value,
  inputClassName = '',
  labelClassName = '',
  propLabelInfo = '',
}: IInputForm) => {
  const defaultInputClass = 'inputForm';
  const defaultLabelClass = 'inputForm__label';
  const labelClass = `${defaultLabelClass} ${labelClassName ?? ''}`;
  return (
    <div className='inputForm__wrapper'>
      <input
        type={type}
        id={id}
        className={inputClassName ? `${defaultInputClass} ${inputClassName}` : `${defaultInputClass}`}
        name={name}
        value={value}
        placeholder={placeholder}
        onInput={handler}
      />
      <label htmlFor={id} className={labelClass}>
        {propLabelInfo}
      </label>
    </div>
  );
};

export default InputForm;
