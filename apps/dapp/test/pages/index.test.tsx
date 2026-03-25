import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Home from '../../pages';

describe('Home component', function () {
  it('renders correctly', function () {
    render(<Home />);
    expect(
      screen.getByText('Stop sending crypto on a promise.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Create a Contract')).toBeInTheDocument();
    expect(screen.getByText('View Your Contracts')).toBeInTheDocument();
  });
});
