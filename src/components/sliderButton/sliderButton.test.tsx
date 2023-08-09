import { render, screen } from '@testing-library/react';
import SliderButton from './sliderButton';

test('button rendets', () => {
  render(<SliderButton text={{first: 'Step 1', second: 'Step 2'}} firstStep={true} handler={() => null} />);
  const sliderElementFirst = screen.getByText(/Step 1/i);
  const sliderElementSecond = screen.getByText(/Step 2/i);
  expect(sliderElementFirst).toBeInTheDocument();
  expect(sliderElementSecond).toBeInTheDocument();
});