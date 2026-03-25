import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Home from '../../pages';

describe('Home component', function () {
  it('renders correctly', function () {
    render(<Home />);
    expect(
      screen.getByText('Secure Escrow for Web3 Freelancers'),
    ).toBeInTheDocument();
    expect(screen.getByText('Create Contract')).toBeInTheDocument();
    expect(screen.getByText('View Existing Contracts')).toBeInTheDocument();
  });
});
