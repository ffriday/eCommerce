interface IInputForm {
  name:string;
  id:string;
  className:string;
}

const InputForm =(props:IInputForm)=>{
  return (<input
    type="text"
    id={props.id}
    className={props.className}
    name={props.name}
  />);
};

export default InputForm;