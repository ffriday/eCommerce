import { FC, useState } from 'react';
import './styles.scss';

export const Counter: FC = () => {
  const [counter, setCounter] = useState<number>(0);

  function handlerOnCLick() {
    setCounter((counter) => counter + 1);
  }

  return (
    <div className='counter'>
      <button className='counter__button' onClick={handlerOnCLick} data-testid='counter-button'>
        Counter: {counter}
      </button>
    </div>
  );
};
