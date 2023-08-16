import './inputForm.scss';
import { IInputhandler } from '../../constants/types';

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
  inputClassName?: string;
  labelClassName?: string;
  propLabelInfo?: string;
  autocomplete?: IInputAutocomplete;
}
const InputForm = ({
  name,
  type,
  id,
  placeholder,
  handler,
  inputClassName = '',
  labelClassName = '',
  propLabelInfo = '',
  autocomplete,
}: IInputForm) => {
  const defaultInputClass = 'inputForm';
  const defaultLabelClass = 'inputForm__label';
  const labelClass = `${defaultLabelClass} ${labelClassName ?? ''}`;
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
        {propLabelInfo}
      </label>
    </div>
  );
};

export default InputForm;
