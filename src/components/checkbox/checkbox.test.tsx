import { render, screen } from '@testing-library/react';
import Checkbox from './checkbox';

test('input rendets', () => {
  render(<Checkbox id='checkbox' isSelected={false} title='Запомнить меня' link={{ path: '#', text: 'Забыли пароль' }} />);
  const checkboxes = screen.getAllByTestId('checkbox');
  expect(checkboxes.length).toBeGreaterThan(0);
});
