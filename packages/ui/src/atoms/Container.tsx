import { isBackdropFilterSupported } from '@smartinvoicexyz/utils';
import { CSSProperties, PropsWithChildren, useEffect, useState } from 'react';

interface ContainerProps extends PropsWithChildren {
  overlay?: boolean;
  className?: string;
  style?: CSSProperties;
}

type OverlayStyles = {
  backgroundColor: string;
  backdropFilter?: string;
};

export function Container({ children, overlay, className, style }: ContainerProps) {
  const [overlayStyles, setOverlayStyles] = useState<OverlayStyles>({
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  });

  useEffect(() => {
    if (isBackdropFilterSupported()) {
      setOverlayStyles({
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
      });
    } else {
      setOverlayStyles({
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      });
    }
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center w-[calc(100%-2rem)] h-full flex-1 m-4 ${className ?? ''}`}
      style={overlay ? { ...overlayStyles, ...style } : style}
    >
      {children}
    </div>
  );
}
