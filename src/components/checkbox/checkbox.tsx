import './checkbox.scss';

interface ICheckbox {
  id: string;
  isSelected: boolean;
  className?: string;
}

const checkbox = (props: ICheckbox) => {
  return (
    <input
      type='checkbox'
      id={props.id}
      className={props.className ? `checkbox ${props.className}` : 'checkbox'}
      defaultChecked={props.isSelected}
    />
  );
};

export default checkbox;
