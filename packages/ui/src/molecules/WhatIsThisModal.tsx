import { useEffect } from 'react';

type WhatIsThisModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function WhatIsThisModal({ isOpen, onClose }: WhatIsThisModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative p-8 max-w-[40rem] w-full bg-black border-2 border-red-500 text-white mx-4"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-red-500 hover:bg-white/10 rounded transition-colors text-lg"
          aria-label="Close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z" />
          </svg>
        </button>

        <div className="flex flex-col gap-4 w-full">
          <h2 className="font-normal mb-4 uppercase text-center text-2xl">
            Safe, Efficient Payment
          </h2>

          <p>
            Smart invoice builds trust between payer and payee by creating a
            secure neutral channel for transferring money. The payer proves
            their commitment by locking money in the contract, and controls
            when it is released to the payee. No middle party, no leap of
            faith, and you don&apos;t even have to use the word escrow if you
            don&apos;t want to.
          </p>

          <p className="w-full">
            If you have more questions,{' '}
            <a
              href="https://docs.smartinvoice.xyz"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              check out our FAQ.
            </a>
          </p>

          <p className="w-full mb-4">
            You can read more about the future of payment at{' '}
            <a
              href="https://discord.gg/CanD2WcK7W"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Raid Guild
            </a>
            .
          </p>

          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-mono font-normal text-sm sm:text-base md:text-lg transition-colors"
            onClick={onClose}
          >
            Got it. Thanks
          </button>
        </div>
      </div>
    </div>
  );
}
