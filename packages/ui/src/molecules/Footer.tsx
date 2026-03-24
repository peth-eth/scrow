import _ from 'lodash';

const links = [
  { label: 'Website', href: 'https://smartinvoice.xyz' },
  {
    label: 'Docs',
    href: 'https://smartinvoice.xyz/getting-started/what-is-smart-invoice',
  },
  { label: 'Twitter', href: 'https://twitter.com/SmartInvoiceXYZ' },
  { label: 'Discord', href: 'https://discord.gg/Rws3gEu8W7' },
];

export function Footer() {
  return (
    <div className="bg-[#334D6E] w-full self-end z-[5]">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center px-20 py-4 text-white gap-y-4">
        <a href="/invoices">
          <img
            src="/assets/smart-invoice/white.svg"
            alt="Smart Invoice"
            width={160}
            height={25.34}
          />
        </a>

        <div className="flex gap-8 justify-center items-center">
          {_.map(links, ({ label, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base hover:underline"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
