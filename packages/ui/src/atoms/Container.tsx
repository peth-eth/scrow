import { CSSProperties, PropsWithChildren } from 'react';

interface ContainerProps extends PropsWithChildren {
  overlay?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Container({
  children,
  overlay,
  className,
  style,
}: ContainerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full max-w-5xl h-full flex-1 mx-auto px-4 ${
        overlay ? 'rounded-xl bg-card/50 backdrop-blur-sm my-4' : ''
      } ${className ?? ''}`}
      style={style}
    >
      {children}
    </div>
  );
}
