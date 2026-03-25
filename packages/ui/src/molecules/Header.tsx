import { ConnectButton } from '@rainbow-me/rainbowkit';
import _ from 'lodash';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { ChakraNextLink } from '../atoms';
import { HamburgerIcon } from '../icons/HamburgerIcon';

type Link = {
  label: string;
  href: string;
  isInternal?: boolean;
};

const LINKS: Link[] = [
  { label: 'My Contracts', href: '/invoices', isInternal: true },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => setIsOpen(prev => !prev);
  const { address } = useAccount();
  const isConnected = !!address;

  const links = isConnected ? LINKS : LINKS.slice(1);

  return (
    <div className="flex w-full h-[75px] px-8 py-4 text-muted-foreground font-mono justify-between items-center bg-background z-[5] relative">
      <div className="flex items-center gap-6">
        <ChakraNextLink href="/">
          <div className="cursor-pointer">
            <img
              src="/scrow-logo.png"
              alt="sCrow"
              className="rounded-md"
              style={{ height: 38 }}
            />
          </div>
        </ChakraNextLink>

        <div className="hidden lg:flex gap-6 items-center">
          {_.map(links, ({ label, href }) => (
            <ChakraNextLink
              key={href}
              href={href}
              isExternal={!href?.startsWith('/')}
              className="hover:text-primary transition-colors"
            >
              {label}
            </ChakraNextLink>
          ))}
        </div>
      </div>

      <div className="flex items-center h-32 transition-[width] duration-1000 ease-out justify-end">
        <div className="hidden lg:flex justify-end">
          <ConnectButton
            accountStatus="full"
            chainStatus="none"
            showBalance={false}
          />
        </div>
        <button
          onClick={onToggle}
          className="flex lg:hidden ml-2 sm:ml-4 z-[7] bg-transparent border-none cursor-pointer"
        >
          <HamburgerIcon
            className="w-8 h-8 sm:w-11 sm:h-11 text-primary transition-all duration-500 ease-out hover:rotate-90"
          />
        </button>
      </div>

      <div
        className="fixed inset-0 z-[6] bg-background flex flex-col items-center justify-center gap-6 transition-all duration-[2s] ease-out"
        style={{
          clipPath: isOpen
            ? 'circle(calc(100vw + 100vh) at 90% -10%)'
            : 'circle(100px at 90% -20%)',
          pointerEvents: isOpen ? 'all' : 'none',
        }}
      >
        <ConnectButton
          accountStatus="address"
          chainStatus="none"
          showBalance={false}
        />

        {_.map(links, ({ label, href, isInternal }) => (
          <ChakraNextLink
            href={href}
            key={href}
            isExternal={!href?.startsWith('/')}
            onClick={isInternal ? onToggle : undefined}
          >
            <button className="relative bg-transparent border-none text-muted-foreground font-normal text-lg cursor-pointer transition-all duration-500 ease-[0.4s] after:content-[''] after:block after:h-0.5 after:w-0 after:bg-primary after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200 after:ease-in-out hover:after:w-full hover:no-underline">
              {label}
            </button>
          </ChakraNextLink>
        ))}
      </div>
    </div>
  );
}
