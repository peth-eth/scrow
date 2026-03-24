import { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  boxSize?: number | string;
}

export function getIconSize(boxSize?: number | string): string {
  if (boxSize === undefined) return '1em';
  if (typeof boxSize === 'number') return `${boxSize * 4}px`;
  return boxSize;
}
