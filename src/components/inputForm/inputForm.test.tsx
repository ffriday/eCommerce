import { render, screen } from '@testing-library/react';
import InputForm from './inputForm';

test('input rendets', () => {
  render(<InputForm name='name' type='text' id='0' placeholder='Ваш пароль' />);
  const inputElement = screen.getByPlaceholderText(/Ваш пароль/i);
  expect(inputElement).toBeInTheDocument();
});
