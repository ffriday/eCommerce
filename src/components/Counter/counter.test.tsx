import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('Counter component', () => {
  test('should be rendered', () => {
    render(<App />);

    const counter = screen.getByTestId('counter-button');
    expect(counter).toBeInTheDocument();
  });

  test('should increase the counter after clicking', () => {
    render(<App />);

    const counter = screen.getByTestId('counter-button');
    fireEvent.click(counter);
    expect(counter).toHaveTextContent('1');

    fireEvent.click(counter);
    expect(counter).toHaveTextContent('2');
  });
});
