import './inputForm.scss';

interface IInputForm {
  name: string;
  id: string;
  // isValid:()=>boolean;
  placeholder: string;
  className?: string;
}

const InputForm = (props: IInputForm) => {
  // const validation = props.isValid();
  const defaultClass = 'inputForm';
  // const inValidClass = 'inputForm--invaild';
  // const inputClassName = validation?defaultClass:defaultClass+inValidClass;
  return (
    <input
      type='text'
      id={props.id}
      // isValid = { props.isValid}
      className={props.className ? `${defaultClass} ${props.className}` : `${defaultClass}`}
      name={props.name}
      placeholder={props.placeholder}
    />
  );
};

export default InputForm;
