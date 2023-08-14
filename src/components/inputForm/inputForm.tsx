import './inputForm.scss';

interface IInputForm {
  name: string;
  type: string;
  id: string;
  placeholder: string;
  handler?: (event: React.FormEvent<HTMLInputElement>) => void;
  inputClassName?: string;
  labelClassName?: string;
  propLabelInfo?: string;
}
const InputForm = ({ name, type, id, placeholder, handler, inputClassName = '', labelClassName = '', propLabelInfo = '' }: IInputForm) => {
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
