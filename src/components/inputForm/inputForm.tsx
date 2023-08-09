import './inputForm.scss';

interface IInputForm {
  name: string;
  id: string;
  placeholder: string;
  className?: string;
}

const InputForm = (props: IInputForm) => {
  return (
    <input
      type='text'
      id={props.id}
      className={props.className ? `inputForm ${props.className}` : 'inputForm'}
      name={props.name}
      placeholder={props.placeholder}
    />
  );
};

export default InputForm;
