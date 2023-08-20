import './inputForm.scss';
import { IInputhandler } from '../../constants/types';
import { useState } from 'react';

export interface IInputAutocomplete {
  listName: string;
  dataList: string[];
}

export interface IInputForm {
  name: string;
  type: string;
  id: string;
  placeholder: string;
  handler?: IInputhandler;
  value?: string | number;
  inputClassName?: string;
  labelClassName?: string;
  propLabelInfo?: string;
  disabled?: boolean;
  autocomplete?: IInputAutocomplete;
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
  disabled = false,
  autocomplete,
}: IInputForm) => {
  const [inputType, setInputType] = useState(type);
  const [hidePassword, setHidePassword] = useState('');
  const defaultInputClass = 'inputForm';
  const defaultLabelClass = 'inputForm__label';
  const labelClass = `${defaultLabelClass} ${labelClassName ?? ''}`;
  const toggleShowPasswordHandler = () => {
    if (inputType === 'password') {
      setInputType('text');
      setHidePassword('inputForm__hide-password');
    } else {
      setInputType('password');
      setHidePassword('');
    }
  };
  return (
    <div className='inputForm__wrapper'>
      <input
        type={inputType}
        id={id}
        className={inputClassName ? `${defaultInputClass} ${inputClassName}` : `${defaultInputClass}`}
        name={name}
        value={value}
        placeholder={placeholder}
        onInput={handler}
        disabled={disabled}
        {...(autocomplete !== undefined ? { list: autocomplete.listName, autoComplete: autocomplete.listName } : {})}
      />
      {autocomplete !== undefined ? (
        <datalist id={autocomplete.listName}>
          {autocomplete.dataList.map((element, i) => (
            <option key={`${autocomplete.listName}-${i}`}>{element}</option>
          ))}
        </datalist>
      ) : null}
      <label htmlFor={id} className={labelClass}>
        {propLabelInfo}
      </label>
      {id === 'password' && <div className={`inputForm__show-password ${hidePassword}`} onClick={toggleShowPasswordHandler}></div>}
    </div>
  );
};

export default InputForm;
