import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Checkbox from './checkbox';

test('input rendets', () => {
  render(
    <BrowserRouter>
      <Checkbox id='checkbox' handler={() => 'test'} title='Запомнить меня' link={{ path: '/registration', text: 'Забыли пароль' }} />{' '}
    </BrowserRouter>,
  );
  const checkboxes = screen.getAllByTestId('checkbox');
  expect(checkboxes.length).toBeGreaterThan(0);
});
