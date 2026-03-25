import { render } from '@testing-library/react';
import React from 'react';

import { ErrorBoundary } from '../../src/molecules/ErrorBoundary';

function ThrowingChild(): React.JSX.Element {
  throw new Error('Test error');
}

describe('ErrorBoundary', function () {
  it('should render fallback when child throws', function () {
    // Suppress console.error from React's error boundary logging
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const view = render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(view.getByText('Something went wrong')).toBeTruthy();

    consoleSpy.mockRestore();
  });

  it('should render children when no error', function () {
    const view = render(
      <ErrorBoundary>
        <div>Hello</div>
      </ErrorBoundary>,
    );

    expect(view.getByText('Hello')).toBeTruthy();
  });
});
