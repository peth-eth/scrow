import React from 'react';

import { getIconSize, IconProps } from './types';

export const FilterIcon: React.FC<IconProps> = ({
  boxSize,
  ...props
}) => {
  const size = getIconSize(boxSize);
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill="currentColor" {...props}>
      <path d="M4 8L0.535898 5L7.4641 5L4 8Z" fill="#99A6B6" />
      <path d="M4 3.49691e-07L0.535898 3L7.4641 3L4 3.49691e-07Z" fill="#99A6B6" />
    </svg>
  );
};
