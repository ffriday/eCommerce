import './inputForm.scss';
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
  inputClassName?: string;
  labelClassName?: string;
  propLabelInfo?: string;
  autocomplete?: IInputAutocomplete;
}

const InputForm = ({ name, type, id, placeholder, inputClassName = '', labelClassName = '', propLabelInfo = '', autocomplete }: IInputForm) => {
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
  };
  return (
    <div className='inputForm__wrappers'>
      <input
        type={type}
        id={id}
        className={inputClassName ? `${defaultInputClass} ${inputClassName}` : `${defaultInputClass}`}
        name={name}
        placeholder={placeholder}
        onInput={handler}
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
        {labelInfo}
      </label>
    </div>
  );
};

export default InputForm;
