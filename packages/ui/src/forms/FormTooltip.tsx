import { ReactNode, useState } from 'react';

import { InfoOutlineIcon } from '../icons';

/**
 * CSS-only tooltip for form field hints.
 * Uses absolute positioning — no Radix/shadcn dependency.
 */
export function FormTooltip({
  content,
}: {
  content: string | ReactNode;
}) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      <button
        type="button"
        tabIndex={0}
        className="inline-flex cursor-help"
        aria-label="More info"
      >
        <InfoOutlineIcon
          boxSize={3}
          className="text-primary bg-background rounded-full"
        />
      </button>
      {show && (
        <div
          role="tooltip"
          className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 z-50 w-64 rounded-md bg-popover border border-border px-3 py-2 text-xs text-popover-foreground shadow-md"
        >
          {content}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-popover" />
        </div>
      )}
    </span>
  );
}
