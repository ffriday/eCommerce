import './styles.scss';
import InputForm from '../inputForm/inputForm';
import Checkbox from '../checkbox/checkbox';

export default function App() {
  return (
    <>
      <h1 className='app'>Blossom</h1>
      <InputForm name='password' id='input-password' placeholder='Введите пароль' />
      <Checkbox
        id='checkbox'
        handler={() =>'test'}
        isSelected={false}
        title='Запомнить меня'
        link={{ path: '#', text: 'Забыли пароль' }}
      />
    </>
  );
}
