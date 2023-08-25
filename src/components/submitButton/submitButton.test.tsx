import { render, screen } from '@testing-library/react';
import SubmitButton from './submitButton';

test('button rendets', () => {
  render(<SubmitButton text='Login' disabled={false} className='login' />);
  const buttonElement = screen.getByText(/Login/i);
  expect(buttonElement).toBeInTheDocument();
});
