/* eslint-disable @typescript-eslint/no-explicit-any */
import { logError } from '@smartinvoicexyz/utils';
import React from 'react';

export class ErrorBoundary extends React.Component {
  // eslint-disable-next-line react/static-property-placement
  props: any;

  // eslint-disable-next-line react/state-in-constructor
  state: any;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    if (error) {
      return { hasError: true };
    }
    return { hasError: false };
  }

  componentDidCatch(error: any, errorInfo: any) {
    logError({ error, errorInfo });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#F5F6F8] text-[#3D88F8]">
          <p className="text-lg">Something went wrong</p>
          <p>Please check console for errors</p>
        </div>
      );
    }

    return children;
  }
}
